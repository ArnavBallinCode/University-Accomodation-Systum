from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from pathlib import Path
from typing import Any

from fastapi import Body, Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import delete, insert, select, text, update
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy.sql import sqltypes

from .auth import (
    AuthUser,
    authenticate_user,
    create_access_token,
    require_roles,
    user_profile,
)
from .database import get_session, get_table


TABLE_CONFIG: dict[str, dict[str, Any]] = {
    "staff": {"table": "staff", "pk": "staff_id", "id_type": "int", "auto_pk": True},
    "courses": {"table": "courses", "pk": "course_number", "id_type": "str", "auto_pk": False},
    "students": {"table": "students", "pk": "banner_id", "id_type": "str", "auto_pk": False},
    "halls": {"table": "halls", "pk": "hall_id", "id_type": "int", "auto_pk": True},
    "apartments": {"table": "apartments", "pk": "apartment_id", "id_type": "int", "auto_pk": True},
    "rooms": {"table": "rooms", "pk": "place_number", "id_type": "int", "auto_pk": False},
    "leases": {"table": "leases", "pk": "lease_id", "id_type": "int", "auto_pk": True},
    "invoices": {"table": "invoices", "pk": "invoice_id", "id_type": "int", "auto_pk": True},
    "next-of-kin": {"table": "next_of_kin", "pk": "kin_id", "id_type": "int", "auto_pk": True},
    "inspections": {"table": "inspections", "pk": "inspection_id", "id_type": "int", "auto_pk": True},
}


app = FastAPI(title="University Accommodation Office API", version="2.0.0-python")

READ_ROLES = require_roles("admin", "manager", "viewer")
WRITE_ROLES = require_roles("admin", "manager")
ADMIN_ROLE = require_roles("admin")


class LoginRequest(BaseModel):
    username: str
    password: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROJECT_ROOT = Path(__file__).resolve().parents[2]
FRONTEND_DIR = PROJECT_ROOT / "frontend"
FRONTEND_DIST_DIR = FRONTEND_DIR / "dist"
FRONTEND_INDEX_PATH = FRONTEND_DIST_DIR / "index.html"

FRONTEND_ASSETS_DIR = FRONTEND_DIST_DIR / "assets"
if FRONTEND_ASSETS_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_ASSETS_DIR)), name="assets")


@app.get("/", include_in_schema=False, response_model=None)
def index() -> Any:
    if FRONTEND_INDEX_PATH.exists():
        return FileResponse(FRONTEND_INDEX_PATH)
    return {
        "message": "Frontend build is missing. Run npm install && npm run build inside frontend/."
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "uni-accom-api-python"}


@app.post("/auth/login")
def auth_login(payload: LoginRequest) -> dict[str, Any]:
    user = authenticate_user(payload.username.strip(), payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(user)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_profile(user),
    }


@app.get("/auth/me")
def auth_me(current_user: AuthUser = Depends(READ_ROLES)) -> dict[str, str | bool]:
    return user_profile(current_user)


def _entity_config(entity: str) -> dict[str, Any]:
    if entity not in TABLE_CONFIG:
        raise HTTPException(status_code=404, detail="entity not found")
    return TABLE_CONFIG[entity]


def _parse_record_id(config: dict[str, Any], record_id: str) -> Any:
    if config["id_type"] == "int":
        try:
            return int(record_id)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail="invalid id format") from exc
    return record_id


def _parse_date(value: str, field_name: str) -> date:
    try:
        return date.fromisoformat(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"{field_name} must use YYYY-MM-DD format") from exc


def _normalize_value(column, field_name: str, value: Any) -> Any:
    if value == "":
        return None

    if value is None:
        return None

    column_type = column.type

    if isinstance(column_type, sqltypes.Date):
        if isinstance(value, date):
            return value
        if isinstance(value, str):
            return _parse_date(value, field_name)
        raise HTTPException(status_code=400, detail=f"{field_name} must use YYYY-MM-DD format")

    if isinstance(column_type, sqltypes.DateTime):
        if isinstance(value, datetime):
            return value
        if isinstance(value, str):
            try:
                return datetime.fromisoformat(value)
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=f"{field_name} must use ISO datetime format") from exc
        raise HTTPException(status_code=400, detail=f"{field_name} must use ISO datetime format")

    if isinstance(column_type, sqltypes.Boolean):
        if isinstance(value, bool):
            return value
        if isinstance(value, (int, float)):
            return bool(value)
        if isinstance(value, str):
            lowered = value.strip().lower()
            if lowered in {"1", "true", "yes", "y"}:
                return True
            if lowered in {"0", "false", "no", "n"}:
                return False
        raise HTTPException(status_code=400, detail=f"{field_name} must be boolean")

    if isinstance(column_type, (sqltypes.Integer, sqltypes.BigInteger)):
        try:
            return int(value)
        except (TypeError, ValueError) as exc:
            raise HTTPException(status_code=400, detail=f"{field_name} must be integer") from exc

    if isinstance(column_type, (sqltypes.Numeric, sqltypes.Float, sqltypes.DECIMAL)):
        try:
            return float(value)
        except (TypeError, ValueError) as exc:
            raise HTTPException(status_code=400, detail=f"{field_name} must be numeric") from exc

    return value


def _sanitize_payload(config: dict[str, Any], table, payload: dict[str, Any], *, is_update: bool) -> dict[str, Any]:
    pk = config["pk"]
    clean: dict[str, Any] = {}

    for key, value in payload.items():
        if key not in table.c:
            continue

        if is_update and key == pk:
            continue

        if not is_update and config["auto_pk"] and key == pk:
            continue

        clean[key] = _normalize_value(table.c[key], key, value)

    if not is_update and not config["auto_pk"] and pk not in clean:
        raise HTTPException(status_code=400, detail=f"{pk} is required")

    if is_update and len(clean) == 0:
        raise HTTPException(status_code=400, detail="no valid fields provided for update")

    return clean


def _map_integrity_error(error: IntegrityError) -> HTTPException:
    code = None
    orig = getattr(error, "orig", None)
    if orig is not None:
        args = getattr(orig, "args", None)
        if args and len(args) > 0:
            code = args[0]

    if code == 1062:
        return HTTPException(status_code=409, detail="duplicate key constraint violated")
    if code == 1452:
        return HTTPException(status_code=400, detail="foreign key reference is invalid")
    if code in {3819, 1644, 1406}:
        return HTTPException(status_code=400, detail="request violates database validation rules")

    return HTTPException(status_code=400, detail="database constraint violation")


def _safe_commit(session: Session) -> None:
    try:
        session.commit()
    except IntegrityError as exc:
        session.rollback()
        raise _map_integrity_error(exc) from exc
    except SQLAlchemyError as exc:
        session.rollback()
        raise HTTPException(status_code=500, detail="database operation failed") from exc


def _run_report(session: Session, sql: str, params: dict[str, Any] | None = None) -> list[dict[str, Any]]:
    rows = session.execute(text(sql), params or {}).mappings().all()
    return [dict(row) for row in rows]


def _encode(value: Any) -> Any:
    def custom_encoder(obj: Any) -> Any:
        if isinstance(obj, Decimal):
            return float(obj)
        return obj

    return jsonable_encoder(value, custom_encoder={Decimal: custom_encoder})


# Report routes are declared before generic CRUD routes to avoid path conflicts.
@app.get("/api/reports/hall-managers")
def report_hall_managers(
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            h.hall_id,
            h.hall_name,
            CONCAT(s.first_name, ' ', s.last_name) AS manager_name,
            COALESCE(s.internal_phone, '') AS manager_phone
        FROM halls h
        JOIN staff s ON s.staff_id = h.manager_staff_id
        ORDER BY h.hall_id
    """
    return _encode(_run_report(session, sql))


@app.get("/api/reports/student-leases")
def report_student_leases(
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            l.lease_id,
            s.banner_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            l.duration_semesters,
            l.includes_summer_semester,
            l.date_enter,
            l.date_leave,
            r.place_number,
            r.room_number,
            r.monthly_rent,
            CASE WHEN r.hall_id IS NOT NULL THEN 'Hall' ELSE 'Apartment' END AS residence_type,
            CASE WHEN r.hall_id IS NOT NULL THEN h.hall_name ELSE CONCAT('Apartment ', a.apartment_id) END AS residence_name,
            CASE
                WHEN r.hall_id IS NOT NULL THEN CONCAT(h.street, ', ', h.city, ' ', h.postcode)
                ELSE CONCAT(a.street, ', ', a.city, ' ', a.postcode)
            END AS residence_address
        FROM leases l
        JOIN students s ON s.banner_id = l.banner_id
        JOIN rooms r ON r.place_number = l.place_number
        LEFT JOIN halls h ON h.hall_id = r.hall_id
        LEFT JOIN apartments a ON a.apartment_id = r.apartment_id
        ORDER BY s.banner_id, l.lease_id
    """
    return _encode(_run_report(session, sql))


@app.get("/api/reports/summer-leases")
def report_summer_leases(
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            l.lease_id,
            s.banner_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            l.duration_semesters,
            l.includes_summer_semester,
            l.date_enter,
            l.date_leave,
            r.place_number,
            r.room_number,
            r.monthly_rent,
            CASE WHEN r.hall_id IS NOT NULL THEN 'Hall' ELSE 'Apartment' END AS residence_type,
            CASE WHEN r.hall_id IS NOT NULL THEN h.hall_name ELSE CONCAT('Apartment ', a.apartment_id) END AS residence_name,
            CASE
                WHEN r.hall_id IS NOT NULL THEN CONCAT(h.street, ', ', h.city, ' ', h.postcode)
                ELSE CONCAT(a.street, ', ', a.city, ' ', a.postcode)
            END AS residence_address
        FROM leases l
        JOIN students s ON s.banner_id = l.banner_id
        JOIN rooms r ON r.place_number = l.place_number
        LEFT JOIN halls h ON h.hall_id = r.hall_id
        LEFT JOIN apartments a ON a.apartment_id = r.apartment_id
        WHERE l.includes_summer_semester = TRUE
        ORDER BY l.lease_id
    """
    return _encode(_run_report(session, sql))


@app.get("/api/reports/student-rent-paid/{banner_id}")
def report_student_rent_paid(
    banner_id: str,
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            s.banner_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            SUM(CASE WHEN i.date_paid IS NOT NULL THEN i.amount_due ELSE 0 END) AS total_paid
        FROM students s
        LEFT JOIN leases l ON l.banner_id = s.banner_id
        LEFT JOIN invoices i ON i.lease_id = l.lease_id
        WHERE s.banner_id = :banner_id
        GROUP BY s.banner_id, s.first_name, s.last_name
    """
    rows = _run_report(session, sql, {"banner_id": banner_id})
    if not rows:
        raise HTTPException(status_code=404, detail="record not found")
    return _encode(rows[0])


@app.get("/api/reports/unpaid-invoices")
def report_unpaid_invoices(
    due_before: str | None = Query(default=None),
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    effective_due = date.today() if due_before is None else _parse_date(due_before, "due_before")

    sql = """
        SELECT
            i.invoice_id,
            i.lease_id,
            s.banner_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            i.semester,
            i.amount_due,
            DATE_FORMAT(i.due_date, '%Y-%m-%d') AS due_date,
            r.place_number,
            r.room_number,
            CASE WHEN r.hall_id IS NOT NULL THEN 'Hall' ELSE 'Apartment' END AS residence_type,
            CASE
                WHEN r.hall_id IS NOT NULL THEN CONCAT(h.street, ', ', h.city, ' ', h.postcode)
                ELSE CONCAT(a.street, ', ', a.city, ' ', a.postcode)
            END AS residence_address
        FROM invoices i
        JOIN leases l ON l.lease_id = i.lease_id
        JOIN students s ON s.banner_id = l.banner_id
        JOIN rooms r ON r.place_number = l.place_number
        LEFT JOIN halls h ON h.hall_id = r.hall_id
        LEFT JOIN apartments a ON a.apartment_id = r.apartment_id
        WHERE i.date_paid IS NULL
          AND i.due_date <= :due_before
        ORDER BY i.invoice_id
    """
    return _encode(_run_report(session, sql, {"due_before": effective_due}))


@app.get("/api/reports/unsatisfactory-inspections")
def report_unsatisfactory_inspections(
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            i.inspection_id,
            DATE_FORMAT(i.inspection_date, '%Y-%m-%d') AS inspection_date,
            CONCAT(s.first_name, ' ', s.last_name) AS staff_name,
            i.apartment_id,
            COALESCE(i.comments, '') AS comments
        FROM inspections i
        JOIN staff s ON s.staff_id = i.staff_id
        WHERE i.is_satisfactory = FALSE
        ORDER BY i.inspection_date DESC
    """
    return _encode(_run_report(session, sql))


@app.get("/api/reports/hall-student-rooms/{hall_id}")
def report_hall_student_rooms(
    hall_id: int,
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            s.banner_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            h.hall_name,
            r.room_number,
            r.place_number
        FROM leases l
        JOIN students s ON s.banner_id = l.banner_id
        JOIN rooms r ON r.place_number = l.place_number
        JOIN halls h ON h.hall_id = r.hall_id
        WHERE h.hall_id = :hall_id
        ORDER BY s.banner_id
    """
    return _encode(_run_report(session, sql, {"hall_id": hall_id}))


@app.get("/api/reports/waiting-list")
def report_waiting_list(
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            banner_id,
            first_name,
            last_name,
            street,
            city,
            postcode,
            mobile_phone,
            email,
            dob,
            gender,
            category,
            nationality,
            special_needs,
            comments,
            status,
            major,
            minor,
            course_number,
            advisor_staff_id
        FROM students
        WHERE status = 'Waiting'
        ORDER BY banner_id
    """
    return _encode(_run_report(session, sql))


@app.get("/api/reports/student-category-counts")
def report_student_category_counts(
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT category, COUNT(*) AS student_count
        FROM students
        GROUP BY category
        ORDER BY category
    """
    return _encode(_run_report(session, sql))


@app.get("/api/reports/students-without-kin")
def report_students_without_kin(
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            s.banner_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name
        FROM students s
        LEFT JOIN next_of_kin n ON n.banner_id = s.banner_id
        WHERE n.kin_id IS NULL
        ORDER BY s.banner_id
    """
    return _encode(_run_report(session, sql))


@app.get("/api/reports/student-adviser/{banner_id}")
def report_student_adviser(
    banner_id: str,
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            s.banner_id,
            CONCAT(s.first_name, ' ', s.last_name) AS student_name,
            CASE WHEN a.staff_id IS NULL THEN '' ELSE CONCAT(a.first_name, ' ', a.last_name) END AS adviser_name,
            COALESCE(a.internal_phone, '') AS adviser_phone
        FROM students s
        LEFT JOIN staff a ON a.staff_id = s.advisor_staff_id
        WHERE s.banner_id = :banner_id
    """
    rows = _run_report(session, sql, {"banner_id": banner_id})
    if not rows:
        raise HTTPException(status_code=404, detail="record not found")
    return _encode(rows[0])


@app.get("/api/reports/rent-stats")
def report_rent_stats(
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            MIN(monthly_rent) AS min_rent,
            MAX(monthly_rent) AS max_rent,
            AVG(monthly_rent) AS avg_rent
        FROM rooms
        WHERE hall_id IS NOT NULL
    """
    rows = _run_report(session, sql)
    return _encode(rows[0] if rows else {"min_rent": None, "max_rent": None, "avg_rent": None})


@app.get("/api/reports/hall-place-counts")
def report_hall_place_counts(
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            h.hall_id,
            h.hall_name,
            COUNT(r.place_number) AS total_places
        FROM halls h
        LEFT JOIN rooms r ON r.hall_id = h.hall_id
        GROUP BY h.hall_id, h.hall_name
        ORDER BY h.hall_id
    """
    return _encode(_run_report(session, sql))


@app.get("/api/reports/senior-staff")
def report_senior_staff(
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    sql = """
        SELECT
            s.staff_id,
            CONCAT(s.first_name, ' ', s.last_name) AS staff_name,
            TIMESTAMPDIFF(YEAR, s.dob, CURDATE()) AS age,
            s.location
        FROM staff s
        WHERE s.dob IS NOT NULL
          AND TIMESTAMPDIFF(YEAR, s.dob, CURDATE()) > 60
        ORDER BY age DESC, s.staff_id
    """
    return _encode(_run_report(session, sql))


@app.get("/api/{entity}")
def list_records(
    entity: str,
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    config = _entity_config(entity)
    table = get_table(config["table"])

    query = select(table)
    pk_name = config["pk"]
    if pk_name in table.c:
        query = query.order_by(table.c[pk_name])

    rows = session.execute(query).mappings().all()
    return _encode([dict(row) for row in rows])


@app.get("/api/{entity}/{record_id}")
def get_record(
    entity: str,
    record_id: str,
    _: AuthUser = Depends(READ_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    config = _entity_config(entity)
    table = get_table(config["table"])
    pk_name = config["pk"]
    parsed_id = _parse_record_id(config, record_id)

    row = session.execute(select(table).where(table.c[pk_name] == parsed_id)).mappings().first()
    if row is None:
        raise HTTPException(status_code=404, detail="record not found")

    return _encode(dict(row))


@app.post("/api/{entity}")
def create_record(
    entity: str,
    payload: dict[str, Any] = Body(...),
    _: AuthUser = Depends(WRITE_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    config = _entity_config(entity)
    table = get_table(config["table"])
    pk_name = config["pk"]

    values = _sanitize_payload(config, table, payload, is_update=False)

    try:
        result = session.execute(insert(table).values(**values))
        _safe_commit(session)
    except HTTPException:
        raise
    except SQLAlchemyError as exc:
        session.rollback()
        raise HTTPException(status_code=500, detail="failed to create record") from exc

    if config["auto_pk"]:
        inserted = result.inserted_primary_key
        if not inserted:
            raise HTTPException(status_code=500, detail="failed to create record")
        record_id = inserted[0]
    else:
        record_id = values[pk_name]

    created_row = session.execute(select(table).where(table.c[pk_name] == record_id)).mappings().first()
    if created_row is None:
        raise HTTPException(status_code=500, detail="failed to load created record")

    return _encode(dict(created_row))


@app.put("/api/{entity}/{record_id}")
def update_record(
    entity: str,
    record_id: str,
    payload: dict[str, Any] = Body(...),
    _: AuthUser = Depends(WRITE_ROLES),
    session: Session = Depends(get_session),
) -> Any:
    config = _entity_config(entity)
    table = get_table(config["table"])
    pk_name = config["pk"]
    parsed_id = _parse_record_id(config, record_id)

    values = _sanitize_payload(config, table, payload, is_update=True)

    try:
        result = session.execute(update(table).where(table.c[pk_name] == parsed_id).values(**values))
        if result.rowcount == 0:
            session.rollback()
            raise HTTPException(status_code=404, detail="record not found")
        _safe_commit(session)
    except HTTPException:
        raise
    except SQLAlchemyError as exc:
        session.rollback()
        raise HTTPException(status_code=500, detail="failed to update record") from exc

    updated = session.execute(select(table).where(table.c[pk_name] == parsed_id)).mappings().first()
    if updated is None:
        raise HTTPException(status_code=404, detail="record not found")

    return _encode(dict(updated))


@app.delete("/api/{entity}/{record_id}", status_code=204)
def delete_record(
    entity: str,
    record_id: str,
    _: AuthUser = Depends(ADMIN_ROLE),
    session: Session = Depends(get_session),
) -> Response:
    config = _entity_config(entity)
    table = get_table(config["table"])
    pk_name = config["pk"]
    parsed_id = _parse_record_id(config, record_id)

    try:
        result = session.execute(delete(table).where(table.c[pk_name] == parsed_id))
        if result.rowcount == 0:
            session.rollback()
            raise HTTPException(status_code=404, detail="record not found")
        _safe_commit(session)
    except HTTPException:
        raise
    except SQLAlchemyError as exc:
        session.rollback()
        raise HTTPException(status_code=500, detail="failed to delete record") from exc

    return Response(status_code=204)


@app.get("/{full_path:path}", include_in_schema=False, response_model=None)
def spa_fallback(full_path: str) -> Any:
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="not found")
    if full_path.startswith("auth/"):
        raise HTTPException(status_code=404, detail="not found")
    if full_path in {"health", "docs", "redoc", "openapi.json"}:
        raise HTTPException(status_code=404, detail="not found")
    if full_path.startswith("assets/"):
        raise HTTPException(status_code=404, detail="not found")

    if FRONTEND_INDEX_PATH.exists():
        return FileResponse(FRONTEND_INDEX_PATH)

    return {
        "message": "Frontend build is missing. Run npm install && npm run build inside frontend/."
    }
