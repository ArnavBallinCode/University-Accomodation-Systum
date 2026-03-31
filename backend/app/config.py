from __future__ import annotations

from dataclasses import dataclass
import os

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    db_host: str
    db_port: str
    db_user: str
    db_password: str
    db_name: str
    db_tls_mode: str
    db_ca_cert_path: str | None
    port: int


def _required_env(key: str) -> str:
    value = os.getenv(key, "").strip()
    if value == "":
        raise RuntimeError(f"{key} is required")
    return value


def get_settings() -> Settings:
    port_raw = os.getenv("PORT", "8000").strip()
    try:
        port = int(port_raw)
    except ValueError as exc:
        raise RuntimeError("PORT must be a valid integer") from exc

    return Settings(
        db_host=_required_env("DB_HOST"),
        db_port=_required_env("DB_PORT"),
        db_user=_required_env("DB_USER"),
        db_password=os.getenv("DB_PASSWORD", ""),
        db_name=_required_env("DB_NAME"),
        db_tls_mode=os.getenv("DB_TLS_MODE", "preferred").strip() or "preferred",
        db_ca_cert_path=(os.getenv("DB_CA_CERT_PATH", "").strip() or None),
        port=port,
    )
