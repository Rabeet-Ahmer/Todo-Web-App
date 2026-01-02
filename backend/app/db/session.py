"""Async database session management for PostgreSQL with connection pooling."""
from contextlib import asynccontextmanager
from typing import AsyncGenerator
import ssl

from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession as SQLAlchemyAsyncSession

from app.config import settings


# Prepare database URL for asyncpg
# asyncpg doesn't support 'sslmode' or 'channel_binding' as query parameters
# Remove them and configure SSL via connect_args instead
database_url = settings.database_url

# Remove incompatible query parameters
if "?" in database_url:
    base_url, query_string = database_url.split("?", 1)
    # Filter out sslmode and channel_binding parameters
    query_params = [
        param for param in query_string.split("&")
        if not param.startswith("sslmode=") and not param.startswith("channel_binding=")
    ]
    database_url = base_url if not query_params else f"{base_url}?{'&'.join(query_params)}"

# Create SSL context for Neon PostgreSQL (requires SSL)
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False  # Neon uses pooler hostname
ssl_context.verify_mode = ssl.CERT_NONE  # Equivalent to sslmode=require

# Create async engine with connection pooling
async_engine = create_async_engine(
    database_url,
    echo=settings.environment == "development",  # Log SQL queries in development
    pool_pre_ping=True,  # Verify connections before using
    pool_size=settings.db_pool_size,
    max_overflow=settings.db_max_overflow,
    connect_args={
        "ssl": ssl_context,  # Pass SSL context to asyncpg
    },
)


@asynccontextmanager
async def get_session() -> AsyncGenerator[SQLAlchemyAsyncSession, None]:
    """
    Dependency for getting async database session.

    Usage:
        async def endpoint(session: AsyncSession = Depends(get_session)):
            ...
    """
    async with SQLAlchemyAsyncSession(async_engine, expire_on_commit=False) as session:
        yield session


async def init_db() -> None:
    """
    Initialize database tables.

    This should be called on application startup.
    """
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def close_db() -> None:
    """
    Close database connections.

    This should be called on application shutdown.
    """
    await async_engine.dispose()
