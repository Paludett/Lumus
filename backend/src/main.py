import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect

from . import models
from .db import SessionLocal, engine
from .routes import router
from .seed import seed_courses
from .settings import (
    BACKEND_CORS_ALLOW_CREDENTIALS,
    BACKEND_CORS_HEADERS,
    BACKEND_CORS_METHODS,
    BACKEND_CORS_ORIGINS,
)

logger = logging.getLogger(__name__)


def _has_required_tables() -> bool:
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    required_tables = {"categories", "courses", "modules"}
    return required_tables.issubset(existing_tables)


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        if _has_required_tables():
            with SessionLocal() as db:
                seed_courses(db)
        else:
            logger.warning("Skipping seed: required tables not found. Run Alembic migrations first.")
    except Exception as e:
        logger.warning(f"Could not verify tables at startup (database may not be ready): {e}. Continuing without seeding.")
    yield

def create_app() -> FastAPI:
    api = FastAPI(lifespan=lifespan)
    api.add_middleware(
        CORSMiddleware,
        allow_origins=BACKEND_CORS_ORIGINS,
        allow_credentials=BACKEND_CORS_ALLOW_CREDENTIALS,
        allow_methods=BACKEND_CORS_METHODS,
        allow_headers=BACKEND_CORS_HEADERS,
    )
    api.include_router(router)
    return api

app = create_app()
