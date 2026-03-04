from pydantic_settings import BaseSettings


from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Finosage API"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
    ]
    MONGO_URL: str = ""
    JWT_SECRET: str = "finosage-secret-key-change-in-production"
    SMTP_EMAIL: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    DEFAULT_NUM_PATHS: int = 10_000
    DEFAULT_HORIZON: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False
    )


settings = Settings()
