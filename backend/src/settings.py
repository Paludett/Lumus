import os
from typing import Final
from dotenv import load_dotenv

load_dotenv()

def _env_list(name: str, default: str, *, upper: bool = False) -> list[str]:
    raw_value = os.getenv(name, default)
    values = [item.strip() for item in raw_value.split(",") if item.strip()]
    if upper:
        values = [item.upper() for item in values]
    return values

def _env_bool(name: str, default: str = "false") -> bool:
    return os.getenv(name, default).strip().lower() == "true"

GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "").strip()
GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()

DB_HOST: str = os.getenv("DB_HOST", "localhost").strip()
DB_PORT: str = os.getenv("DB_PORT", "5432").strip()
DB_NAME: str = os.getenv("DB_NAME", "lumus").strip()
DB_USER: str = os.getenv("DB_USER", "postgres").strip()
DB_PASSWORD: str = os.getenv("DB_PASSWORD", "postgres").strip()

DATABASE_URL: str = os.getenv("DATABASE_URL", "").strip()
if not DATABASE_URL:
    DATABASE_URL = (
        f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )

_DEFAULT_LOCAL_ORIGINS: Final[str] = "http://localhost:5173,http://127.0.0.1:5173"
_DEFAULT_CORS_METHODS: Final[str] = "GET,POST,PUT,DELETE,OPTIONS"
_DEFAULT_CORS_HEADERS: Final[str] = "Content-Type,Authorization"

def _build_cors_settings() -> tuple[list[str], list[str], list[str], bool]:
    cors_origins = _env_list("BACKEND_CORS_ORIGINS", _DEFAULT_LOCAL_ORIGINS)
    cors_methods = _env_list("BACKEND_CORS_METHODS", _DEFAULT_CORS_METHODS, upper=True)
    cors_headers = _env_list("BACKEND_CORS_HEADERS", _DEFAULT_CORS_HEADERS)
    allow_insecure_cors = _env_bool("BACKEND_ALLOW_INSECURE_CORS")

    if not cors_origins:
        cors_origins = _env_list("BACKEND_CORS_ORIGINS", _DEFAULT_LOCAL_ORIGINS)

    if not cors_methods:
        cors_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]

    if not cors_headers:
        cors_headers = ["Content-Type", "Authorization"]

    if allow_insecure_cors:
        cors_origins = ["*"]
        cors_methods = ["*"]
        cors_headers = ["*"]

    cors_allow_credentials = cors_origins != ["*"]
    return cors_origins, cors_methods, cors_headers, cors_allow_credentials

(
    BACKEND_CORS_ORIGINS,
    BACKEND_CORS_METHODS,
    BACKEND_CORS_HEADERS,
    BACKEND_CORS_ALLOW_CREDENTIALS,
) = _build_cors_settings()

BACKEND_CORS_ORIGINS: list[str]
BACKEND_CORS_METHODS: list[str]
BACKEND_CORS_HEADERS: list[str]
BACKEND_CORS_ALLOW_CREDENTIALS: bool
