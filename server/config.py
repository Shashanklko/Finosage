from typing import Union
from pydantic_settings import BaseSettings


from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Finosage API"
    CORS_ORIGINS: Union[str, list[str]] = ["http://localhost:5173", "https://finosage.vercel.app"]

    @property
    def cors_origins_list(self) -> list[str]:
        # If it's a string from env, split it. If it's already a list (default), return it.
        if isinstance(self.CORS_ORIGINS, str):
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return self.CORS_ORIGINS

    MONGO_URL: str = ""
    JWT_SECRET: str = "finosage-secret-key-change-in-production"
    SMTP_EMAIL: str = ""
    GMAIL_TOKEN_JSON: str = ""
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
