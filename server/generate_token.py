import os
import json
import sys

from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

# =========================
# CONFIG
# =========================

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TOKEN_PATH = os.path.join(BASE_DIR, "token.json")
CREDENTIALS_PATH = os.path.join(BASE_DIR, "credentials.json")


# =========================
# HELPERS
# =========================

def delete_bad_token():
    """Delete corrupted/expired token.json"""
    if os.path.exists(TOKEN_PATH):
        try:
            os.remove(TOKEN_PATH)
            print("[+] Deleted invalid token.json")
        except Exception as e:
            print(f"[-] Failed deleting token.json: {e}")


def load_existing_credentials():
    """Load token.json if available"""
    if not os.path.exists(TOKEN_PATH):
        return None

    try:
        creds = Credentials.from_authorized_user_file(
            TOKEN_PATH,
            SCOPES
        )
        return creds

    except Exception as e:
        print(f"[-] Failed loading token.json: {e}")
        delete_bad_token()
        return None


def refresh_credentials(creds):
    """Refresh expired token"""
    try:
        print("→ Refreshing existing OAuth token...")
        creds.refresh(Request())
        print("[+] Token refreshed successfully")
        return creds

    except Exception as e:
        print(f"[-] Refresh failed: {e}")
        delete_bad_token()
        return None


def generate_new_credentials():
    """Run local OAuth flow"""

    if not os.path.exists(CREDENTIALS_PATH):
        print("\nERROR: credentials.json not found")
        print(f"Expected location:\n{CREDENTIALS_PATH}\n")

        print("Create a NEW Desktop OAuth Client:")
        print("1. https://console.cloud.google.com/apis/credentials")
        print("2. Create Credentials")
        print("3. OAuth Client ID")
        print("4. Application Type = Desktop App")
        print("5. Download JSON")
        print("6. Rename to credentials.json")

        return None

    try:
        print("→ Starting Google OAuth flow...")

        flow = InstalledAppFlow.from_client_secrets_file(
            CREDENTIALS_PATH,
            SCOPES
        )

        creds = flow.run_local_server(
            host="localhost",
            port=0,
            access_type="offline",
            prompt="consent"
        )

        print("[+] OAuth authorization successful")
        return creds

    except Exception as e:
        print(f"[-] OAuth flow failed:\n{e}")
        return None


def save_credentials(creds):
    """Save token.json"""

    try:
        with open(TOKEN_PATH, "w") as token:
            token.write(creds.to_json())

        print(f"[+] Saved token.json -> {TOKEN_PATH}")

    except Exception as e:
        print(f"[-] Failed saving token.json: {e}")


def print_render_env(creds):
    """Print Render-ready env var"""

    print("\n" + "=" * 80)
    print("COPY THIS INTO RENDER ENV VARIABLE".center(80))
    print("=" * 80)

    print(creds.to_json())

    print("=" * 80)

    print("\nRender ENV variable:")
    print("KEY   = GMAIL_TOKEN_JSON")
    print("VALUE = paste the JSON above")


# =========================
# MAIN
# =========================

def main():

    creds = load_existing_credentials()

    # valid token
    if creds and creds.valid:
        print("[+] Existing token is valid")

    # expired token with refresh token
    elif creds and creds.expired and creds.refresh_token:
        creds = refresh_credentials(creds)

    # no token / invalid token
    if not creds:
        creds = generate_new_credentials()

    if not creds:
        print("[-] Failed obtaining credentials")
        return

    # save fresh token
    save_credentials(creds)

    # print render env
    print_render_env(creds)


if __name__ == "__main__":
    main()