from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta, timezone
import bcrypt
import jwt
import random
import smtplib
import socket
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from bson import ObjectId
from config import settings
from database import get_db

router = APIRouter()


# ---------- models ----------
class SignupRequest(BaseModel):
    firstName: str = ""
    lastName: str = ""
    email: str
    password: str


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str


class ResendOTPRequest(BaseModel):
    email: str


class LoginRequest(BaseModel):
    email: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    newPassword: str


class ProfileUpdateRequest(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    age: Optional[int] = None
    retirementAge: Optional[int] = None
    monthlyExpenses: Optional[float] = None
    riskTolerance: Optional[str] = None  # Conservative, Balanced, Aggressive
    currency: Optional[str] = None  # USD, EUR, INR, AED, SAR


# ---------- helpers ----------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def ensure_aware(dt: datetime) -> datetime:
    """Ensure a datetime is UTC aware."""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def generate_otp() -> str:
    return str(random.randint(100000, 999999))


def _send_email_robust(to_email: str, subject: str, html_content: str, label: str = "OTP") -> bool:
    """Centralized robust SMTP sender for Render environments."""
    if not settings.SMTP_EMAIL or not settings.SMTP_PASSWORD:
        print(f"[!] SMTP not configured — {label} for {to_email} (check .env)")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["From"] = f"Finosage <{settings.SMTP_EMAIL}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(html_content, "html"))

        # 1. DNS Resolution (Forcing IPv4 to avoid Render/Gmail IPv6 issues)
        try:
            smtp_ip = socket.gethostbyname(settings.SMTP_SERVER)
            target = smtp_ip
            print(f"[debug] Resolved {settings.SMTP_SERVER} to {smtp_ip}")
        except Exception as res_err:
            print(f"[!] DNS Resolution failed: {res_err}")
            target = settings.SMTP_SERVER

        # 2. Connection with high timeout (30s for Render cold starts/latency)
        print(f"→ [SMTP] Connecting to {target}:{settings.SMTP_PORT} (Timeout: 30s)...")
        if settings.SMTP_PORT == 465:
            server = smtplib.SMTP_SSL(target, settings.SMTP_PORT, timeout=30)
        else:
            server = smtplib.SMTP(target, settings.SMTP_PORT, timeout=30)
            server.starttls()

        # 3. Authentication
        server.login(settings.SMTP_EMAIL, settings.SMTP_PASSWORD)
        
        # 4. Transmission
        server.sendmail(settings.SMTP_EMAIL, to_email, msg.as_string())
        server.quit()
        
        print(f"[+] {label} successfully sent to {to_email}")
        return True
    except Exception as e:
        print(f"[-] [SMTP:{label}] Failed for {to_email}: {type(e).__name__}: {str(e)}")
        return False


def send_otp_email(to_email: str, otp: str, first_name: str = ""):
    """Send OTP via SMTP (Gmail)."""
    greeting = f"Hi {first_name}," if first_name else "Hi,"
    html = f"""
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto;
                background: #0a0f1a; color: #ffffff; padding: 40px 30px; border-radius: 8px;
                border: 1px solid rgba(212, 175, 55, 0.15);">
        <p style="font-size: 11px; letter-spacing: 4px; color: #d4af37; opacity: 0.6;
                    text-transform: uppercase; margin-bottom: 24px;">FINOSAGE</p>
        <p style="font-size: 14px; color: #ccc; margin-bottom: 20px;">{greeting}</p>
        <p style="font-size: 13px; color: #999; line-height: 1.7; margin-bottom: 28px;">
            Use the code below to verify your email address and activate your Finosage account.
        </p>
        <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.25);
                    border-radius: 6px; text-align: center; padding: 20px; margin-bottom: 28px;">
            <span style="font-size: 32px; letter-spacing: 10px; font-weight: 300;
                            color: #d4af37;">{otp}</span>
        </div>
        <p style="font-size: 11px; color: #666; line-height: 1.6;">
            This code expires in <strong style="color: #999;">10 minutes</strong>.
            If you didn't request this, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #1a1f2e; margin: 24px 0;" />
        <p style="font-size: 10px; color: #444; letter-spacing: 1px;">
            The Analytical Engine · Finosage
        </p>
    </div>
    """
    return _send_email_robust(to_email, f"Finosage — Your Verification Code: {otp}", html, label="OTP")


def send_reset_otp_email(to_email: str, otp: str, first_name: str = ""):
    """Send Password Reset OTP via SMTP."""
    greeting = f"Hi {first_name}," if first_name else "Hi,"
    html = f"""
    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 480px; margin: 0 auto;
                background: #0a0f1a; color: #ffffff; padding: 40px 30px; border-radius: 8px;
                border: 1px solid rgba(212, 175, 55, 0.15);">
        <p style="font-size: 11px; letter-spacing: 4px; color: #d4af37; opacity: 0.6;
                    text-transform: uppercase; margin-bottom: 24px;">FINOSAGE</p>
        <p style="font-size: 14px; color: #ccc; margin-bottom: 20px;">{greeting}</p>
        <p style="font-size: 13px; color: #999; line-height: 1.7; margin-bottom: 28px;">
            You requested to reset your password. Use the code below to proceed.
        </p>
        <div style="background: rgba(212, 175, 55, 0.08); border: 1px solid rgba(212, 175, 55, 0.25);
                    border-radius: 6px; text-align: center; padding: 20px; margin-bottom: 28px;">
            <span style="font-size: 32px; letter-spacing: 10px; font-weight: 300;
                            color: #d4af37;">{otp}</span>
        </div>
        <p style="font-size: 11px; color: #666; line-height: 1.6;">
            This code expires in <strong style="color: #999;">10 minutes</strong>.
            If you didn't request this, please ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #1a1f2e; margin: 24px 0;" />
        <p style="font-size: 10px; color: #444; letter-spacing: 1px;">
            The Analytical Engine · Finosage
        </p>
    </div>
    """
    return _send_email_robust(to_email, f"Finosage — Password Reset Code: {otp}", html, label="Reset OTP")


# ---------- endpoints ----------
@router.post("/signup")
async def signup(req: SignupRequest, background_tasks: BackgroundTasks):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")

    # Check if already verified user
    existing = await db.users.find_one({"email": req.email.lower(), "verified": True})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    otp = generate_otp()
    otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

    # Upsert into pending_users (overwrite if re-signing up before verifying)
    await db.pending_users.update_one(
        {"email": req.email.lower()},
        {
            "$set": {
                "firstName": req.firstName,
                "lastName": req.lastName,
                "email": req.email.lower(),
                "password": hash_password(req.password),
                "otp": otp,
                "otpExpiry": otp_expiry,
                "createdAt": datetime.now(timezone.utc),
            }
        },
        upsert=True,
    )

    # Send OTP email in background for instant response
    print(f"→ [signup] Queuing OTP for {req.email.lower()}...")
    background_tasks.add_task(send_otp_email, req.email.lower(), otp, req.firstName)

    return {
        "success": True,
        "needsVerification": True,
        "message": "OTP sent to your email. Please verify to complete registration.",
    }


@router.post("/verify-otp")
async def verify_otp(req: VerifyOTPRequest):
    db = get_db()
    if db is None:
        print("[-] [verify-otp] Database not connected")
        raise HTTPException(status_code=500, detail="Database not connected")

    print(f"→ [verify-otp] Verifying {req.email}...")
    pending = await db.pending_users.find_one({"email": req.email.lower()})
    if not pending:
        print(f"[-] [verify-otp] No pending user for {req.email}")
        raise HTTPException(status_code=404, detail="No pending registration found for this email")

    # Check expiry
    otp_expiry = ensure_aware(pending["otpExpiry"])
    if datetime.now(timezone.utc) > otp_expiry:
        print(f"[-] [verify-otp] OTP expired for {req.email}")
        raise HTTPException(status_code=410, detail="OTP has expired. Please request a new one.")

    # Check OTP
    if pending["otp"] != req.otp:
        print(f"[-] [verify-otp] Invalid OTP for {req.email}: got {req.otp} expected {pending['otp']}")
        raise HTTPException(status_code=401, detail="Invalid OTP. Please try again.")

    # OTP valid — move to users collection
    user_doc = {
        "firstName": pending.get("firstName", ""),
        "lastName": pending.get("lastName", ""),
        "email": pending["email"],
        "password": pending["password"],
        "verified": True,
        "createdAt": pending.get("createdAt", datetime.now(timezone.utc)),
        "verifiedAt": datetime.now(timezone.utc),
    }

    print(f"[+] [verify-otp] OTP valid. Moving {req.email} to users collection.")
    # Remove any old unverified entry for same email
    await db.users.delete_many({"email": req.email.lower(), "verified": {"$ne": True}})

    result = await db.users.insert_one(user_doc)
    await db.pending_users.delete_one({"email": req.email.lower()})

    token = create_token(str(result.inserted_id), pending["email"])
    return {
        "success": True,
        "token": token,
        "user": {
            "id": str(result.inserted_id),
            "firstName": user_doc["firstName"],
            "lastName": user_doc["lastName"],
            "email": user_doc["email"],
        },
    }


@router.post("/resend-otp")
async def resend_otp(req: ResendOTPRequest, background_tasks: BackgroundTasks):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")

    pending = await db.pending_users.find_one({"email": req.email.lower()})
    if not pending:
        raise HTTPException(status_code=404, detail="No pending registration found")

    otp = generate_otp()
    otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

    await db.pending_users.update_one(
        {"email": req.email.lower()},
        {"$set": {"otp": otp, "otpExpiry": otp_expiry}},
    )

    # Background task for resending
    background_tasks.add_task(send_otp_email, req.email.lower(), otp, pending.get("firstName", ""))

    return {"success": True, "message": "New OTP sent to your email."}


@router.post("/login")
async def login(req: LoginRequest):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")

    user = await db.users.find_one({"email": req.email.lower(), "verified": True})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_token(str(user["_id"]), user["email"])

    return {
        "success": True,
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "firstName": user.get("firstName", ""),
            "lastName": user.get("lastName", ""),
            "email": user["email"],
        },
    }


@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, background_tasks: BackgroundTasks):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")

    user = await db.users.find_one({"email": req.email.lower(), "verified": True})
    if not user:
        # Don't reveal if user exists for security, just return success
        return {"success": True, "message": "If this email is registered, a reset code has been sent."}

    otp = generate_otp()
    expiry = datetime.now(timezone.utc) + timedelta(minutes=10)

    await db.password_resets.update_one(
        {"email": req.email.lower()},
        {"$set": {"otp": otp, "expiry": expiry}},
        upsert=True
    )

    # Background task for reset email
    background_tasks.add_task(send_reset_otp_email, req.email.lower(), otp, user.get("firstName", ""))

    return {"success": True, "message": "Reset code sent to your email."}


@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")

    reset_entry = await db.password_resets.find_one({"email": req.email.lower()})
    if not reset_entry:
        raise HTTPException(status_code=404, detail="No reset request found.")

    reset_expiry = ensure_aware(reset_entry["expiry"])
    if datetime.now(timezone.utc) > reset_expiry:
        raise HTTPException(status_code=410, detail="Reset code has expired.")

    if reset_entry["otp"] != req.otp:
        raise HTTPException(status_code=401, detail="Invalid reset code.")

    # Update password
    new_hashed = hash_password(req.newPassword)
    await db.users.update_one(
        {"email": req.email.lower()},
        {"$set": {"password": new_hashed}}
    )

    # Clean up reset entry
    await db.password_resets.delete_one({"email": req.email.lower()})

    return {"success": True, "message": "Password reset successfully. You can now log in."}


@router.get("/me")
async def get_me(token: str):
    """Verify token and return user profile."""
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    from bson import ObjectId

    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "user": {
            "id": str(user["_id"]),
            "firstName": user.get("firstName", ""),
            "lastName": user.get("lastName", ""),
            "email": user["email"],
        }
    }


@router.get("/profile")
async def get_profile(token: str):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "user": {
            "id": str(user["_id"]),
            "firstName": user.get("firstName", ""),
            "lastName": user.get("lastName", ""),
            "email": user["email"],
            "age": user.get("age"),
            "retirementAge": user.get("retirementAge"),
            "monthlyExpenses": user.get("monthlyExpenses"),
            "riskTolerance": user.get("riskTolerance"),
        }
    }


@router.patch("/profile")
async def update_profile(token: str, req: ProfileUpdateRequest):
    db = get_db()
    if db is None:
        raise HTTPException(status_code=500, detail="Database not connected")

    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    update_data = {}
    if req.firstName is not None: update_data["firstName"] = req.firstName
    if req.lastName is not None: update_data["lastName"] = req.lastName
    if req.age is not None: update_data["age"] = req.age
    if req.retirementAge is not None: update_data["retirementAge"] = req.retirementAge
    if req.monthlyExpenses is not None: update_data["monthlyExpenses"] = req.monthlyExpenses
    if req.riskTolerance is not None: update_data["riskTolerance"] = req.riskTolerance
    if req.currency is not None: update_data["currency"] = req.currency

    if not update_data:
        return {"success": True, "message": "No changes made."}

    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_data}
    )

    user = await db.users.find_one({"_id": ObjectId(user_id)})

    return {
        "success": True,
        "user": {
            "id": str(user["_id"]),
            "firstName": user.get("firstName", ""),
            "lastName": user.get("lastName", ""),
            "email": user["email"],
            "age": user.get("age"),
            "retirementAge": user.get("retirementAge"),
            "monthlyExpenses": user.get("monthlyExpenses"),
            "riskTolerance": user.get("riskTolerance"),
        }
    }
