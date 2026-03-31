from __future__ import annotations

from typing import Iterator
from urllib.parse import quote_plus

from fastapi import HTTPException
from sqlalchemy import MetaData, create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from .config import Settings, get_settings


TABLE_NAMES = [
    "staff",
    "courses",
    "students",
    "halls",
    "apartments",
    "rooms",
    "leases",
    "invoices",
    "next_of_kin",
    "inspections",
]


_engine: Engine | None = None
_session_factory: sessionmaker | None = None
_metadata: MetaData | None = None


def _build_connect_args(settings: Settings) -> dict:
    mode = settings.db_tls_mode
    if mode == "false":
        return {}

    if mode == "skip-verify":
        return {
            "ssl": {
                "check_hostname": False,
            }
        }

    if mode == "preferred":
        if settings.db_ca_cert_path:
            return {
                "ssl": {
                    "ca": settings.db_ca_cert_path,
                }
            }

        return {"ssl": {}}

    raise RuntimeError(f"unsupported DB_TLS_MODE {mode!r}")


def _build_mysql_url(settings: Settings) -> str:
    user = quote_plus(settings.db_user)
    password = quote_plus(settings.db_password)
    return (
        f"mysql+pymysql://{user}:{password}@{settings.db_host}:{settings.db_port}/"
        f"{settings.db_name}?charset=utf8mb4"
    )


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        settings = get_settings()
        _engine = create_engine(
            _build_mysql_url(settings),
            pool_pre_ping=True,
            pool_recycle=300,
            connect_args=_build_connect_args(settings),
            future=True,
        )
    return _engine


def get_session() -> Iterator[Session]:
    global _session_factory
    if _session_factory is None:
        try:
            _session_factory = sessionmaker(bind=get_engine(), autoflush=False, autocommit=False, future=True)
        except RuntimeError as exc:
            raise HTTPException(status_code=500, detail=str(exc)) from exc

    session = _session_factory()
    try:
        yield session
    finally:
        session.close()


def get_metadata() -> MetaData:
    global _metadata
    if _metadata is None:
        metadata = MetaData()
        metadata.reflect(bind=get_engine(), only=TABLE_NAMES)
        _metadata = metadata
    return _metadata


def get_table(table_name: str):
    metadata = get_metadata()
    if table_name not in metadata.tables:
        raise RuntimeError(f"table {table_name!r} is not available in metadata")
    return metadata.tables[table_name]
