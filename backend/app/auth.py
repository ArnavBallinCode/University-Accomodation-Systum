from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
import os
from typing import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext


Role = str


@dataclass(frozen=True)
class AuthUser:
    username: str
    full_name: str
    role: Role
    disabled: bool
    password_hash: str


pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

_SECRET_KEY = os.getenv(
    "AUTH_SECRET_KEY",
    "change-me-in-production-please-use-a-long-random-secret",
)
_ALGORITHM = "HS256"
_TOKEN_EXPIRE_MINUTES = int(os.getenv("AUTH_TOKEN_EXPIRE_MINUTES", "120"))


def _seed_users() -> dict[str, AuthUser]:
    # Default demo users. Replace via env-backed strategy in production.
    defaults = [
        ("admin", "Admin Strategist", "admin", "Admin@123"),
        ("manager", "Residence Manager", "manager", "Manager@123"),
        ("viewer", "Reporting Analyst", "viewer", "Viewer@123"),
    ]

    users: dict[str, AuthUser] = {}
    for username, full_name, role, password in defaults:
        users[username] = AuthUser(
            username=username,
            full_name=full_name,
            role=role,
            disabled=False,
            password_hash=pwd_context.hash(password),
        )

    return users


_USERS = _seed_users()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(username: str, password: str) -> AuthUser | None:
    user = _USERS.get(username)
    if user is None:
        return None
    if user.disabled:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def create_access_token(user: AuthUser, expires_minutes: int | None = None) -> str:
    expire_delta = timedelta(minutes=expires_minutes or _TOKEN_EXPIRE_MINUTES)
    expires_at = datetime.now(timezone.utc) + expire_delta
    payload = {
        "sub": user.username,
        "role": user.role,
        "exp": expires_at,
    }
    return jwt.encode(payload, _SECRET_KEY, algorithm=_ALGORITHM)


def _invalid_token_exc() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(token: str = Depends(oauth2_scheme)) -> AuthUser:
    try:
        payload = jwt.decode(token, _SECRET_KEY, algorithms=[_ALGORITHM])
        username = payload.get("sub")
        role = payload.get("role")
    except JWTError as exc:
        raise _invalid_token_exc() from exc

    if not isinstance(username, str) or not isinstance(role, str):
        raise _invalid_token_exc()

    user = _USERS.get(username)
    if user is None or user.disabled:
        raise _invalid_token_exc()

    if user.role != role:
        raise _invalid_token_exc()

    return user


def require_roles(*allowed_roles: Role) -> Callable[[AuthUser], AuthUser]:
    def dependency(user: AuthUser = Depends(get_current_user)) -> AuthUser:
        if user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Insufficient role permissions")
        return user

    return dependency


def user_profile(user: AuthUser) -> dict[str, str | bool]:
    return {
        "username": user.username,
        "full_name": user.full_name,
        "role": user.role,
        "disabled": user.disabled,
    }


def default_demo_credentials() -> list[dict[str, str]]:
    return [
        {"username": "admin", "password": "Admin@123", "role": "admin"},
        {"username": "manager", "password": "Manager@123", "role": "manager"},
        {"username": "viewer", "password": "Viewer@123", "role": "viewer"},
    ]
