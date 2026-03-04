from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from database import connect_db, close_db
from engines.retirement import router as retirement_router
from engines.portfolio import router as portfolio_router
from engines.goal_planner import router as goal_router
from engines.withdrawal import router as withdrawal_router
from auth import router as auth_router
from history import router as history_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(retirement_router, prefix="/api/retirement", tags=["Retirement"])
app.include_router(portfolio_router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(goal_router, prefix="/api/goals", tags=["Goals"])
app.include_router(withdrawal_router, prefix="/api/withdrawal", tags=["Withdrawal"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(history_router, prefix="/api/history", tags=["History"])


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": settings.APP_NAME}
