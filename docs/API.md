# University Accommodation Office API Reference

This document covers every backend endpoint defined in `backend/app/main.py`, including request contracts, parameters, sample responses, and how each route maps to database operations.

Report note:
- Report endpoints are now backed by SQL views created in `backend/schema.sql`, enabling direct demonstration in MySQL Workbench.

## 1) Base URL and Content Type

- Local backend: `http://localhost:8000`
- Render backend: `https://<your-service>.onrender.com`
- Content type for JSON routes: `application/json`

## 2) Authentication and Authorization

### Authentication mechanism
- JWT bearer tokens.
- Acquire token via `POST /auth/login`.
- Send token in header:

```http
Authorization: Bearer <jwt-token>
```

### Role matrix
- `admin`: read + create + update + delete
- `manager`: read + create + update
- `viewer`: read only

Route protection in code:
- Read routes depend on `READ_ROLES`.
- Write routes depend on `WRITE_ROLES`.
- Delete routes depend on `ADMIN_ROLE`.

## 3) Endpoint Inventory

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/health` | No | Service health check |
| POST | `/auth/login` | No | Login and issue JWT |
| GET | `/auth/me` | Yes (`admin/manager/viewer`) | Validate token and return user profile |
| GET | `/` | No | Serve frontend index if available |
| GET | `/{full_path:path}` | No | SPA fallback for non-API frontend routes |
| GET | `/api/{entity}` | Yes (`admin/manager/viewer`) | List records for one entity |
| GET | `/api/{entity}/{record_id}` | Yes (`admin/manager/viewer`) | Get single record |
| POST | `/api/{entity}` | Yes (`admin/manager`) | Create record |
| PUT | `/api/{entity}/{record_id}` | Yes (`admin/manager`) | Update record |
| DELETE | `/api/{entity}/{record_id}` | Yes (`admin`) | Delete record |
| GET | `/api/reports/hall-managers` | Yes (`admin/manager/viewer`) | Report (a) |
| GET | `/api/reports/student-leases` | Yes (`admin/manager/viewer`) | Report (b) |
| GET | `/api/reports/summer-leases` | Yes (`admin/manager/viewer`) | Report (c) |
| GET | `/api/reports/student-rent-paid/{banner_id}` | Yes (`admin/manager/viewer`) | Report (d) |
| GET | `/api/reports/unpaid-invoices` | Yes (`admin/manager/viewer`) | Report (e) |
| GET | `/api/reports/unsatisfactory-inspections` | Yes (`admin/manager/viewer`) | Report (f) |
| GET | `/api/reports/hall-student-rooms/{hall_id}` | Yes (`admin/manager/viewer`) | Report (g) |
| GET | `/api/reports/waiting-list` | Yes (`admin/manager/viewer`) | Report (h) |
| GET | `/api/reports/student-category-counts` | Yes (`admin/manager/viewer`) | Report (i) |
| GET | `/api/reports/students-without-kin` | Yes (`admin/manager/viewer`) | Report (j) |
| GET | `/api/reports/student-adviser/{banner_id}` | Yes (`admin/manager/viewer`) | Report (k) |
| GET | `/api/reports/rent-stats` | Yes (`admin/manager/viewer`) | Report (l) |
| GET | `/api/reports/hall-place-counts` | Yes (`admin/manager/viewer`) | Report (m) |
| GET | `/api/reports/senior-staff` | Yes (`admin/manager/viewer`) | Report (n) |

## 4) Auth and Utility Endpoints

### 4.1 POST `/auth/login`

Logs in a seeded user and returns a bearer token.

Request body:

```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

Response `200`:

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer",
  "user": {
    "username": "admin",
    "full_name": "Admin Strategist",
    "role": "admin",
    "disabled": false
  }
}
```

DB mapping:
- No database query.
- Uses in-memory seeded users from `backend/app/auth.py`.

### 4.2 GET `/auth/me`

Validates JWT and returns the authenticated user profile.

Parameters:
- Header `Authorization: Bearer <token>` (required)

Response `200`:

```json
{
  "username": "admin",
  "full_name": "Admin Strategist",
  "role": "admin",
  "disabled": false
}
```

DB mapping:
- No database query.
- Token is decoded and checked against in-memory user map.

### 4.3 GET `/health`

Response `200`:

```json
{
  "status": "ok",
  "service": "uni-accom-api-python"
}
```

DB mapping:
- No database query.

### 4.4 GET `/`

Purpose:
- Serves `frontend/dist/index.html` if built.
- Returns message JSON if build is missing.

DB mapping:
- No database query.

### 4.5 GET `/{full_path:path}`

Purpose:
- SPA fallback route for frontend navigation.

Behavior:
- Returns `404` for paths that start with `api/`, `auth/`, `assets/`, and internal docs/openapi paths.
- Otherwise serves `frontend/dist/index.html` if it exists.
- Returns fallback JSON message when frontend build is missing.

DB mapping:
- No database query.

## 5) Generic CRUD API

Generic CRUD routes work across entity names listed in `TABLE_CONFIG`.

### 5.1 Supported entity keys

| URL entity key | Table name | Primary key | PK type | Auto-generated PK |
|---|---|---|---|---|
| `staff` | `staff` | `staff_id` | int | yes |
| `courses` | `courses` | `course_number` | string | no |
| `students` | `students` | `banner_id` | string | no |
| `halls` | `halls` | `hall_id` | int | yes |
| `apartments` | `apartments` | `apartment_id` | int | yes |
| `rooms` | `rooms` | `place_number` | int | no |
| `leases` | `leases` | `lease_id` | int | yes |
| `invoices` | `invoices` | `invoice_id` | int | yes |
| `next-of-kin` | `next_of_kin` | `kin_id` | int | yes |
| `inspections` | `inspections` | `inspection_id` | int | yes |

### 5.2 Route contracts

#### GET `/api/{entity}`
- Returns all rows, ordered by primary key where available.

Sample response `200`:

```json
[
  {
    "staff_id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "j.doe@univ.edu"
  }
]
```

DB mapping:
- `table = get_table(config["table"])`
- `query = select(table).order_by(pk)`
- `rows = session.execute(query).mappings().all()`

#### GET `/api/{entity}/{record_id}`
- Fetches one row by entity primary key.

Path parameters:
- `record_id` (type depends on entity PK type)

Sample response `200`:

```json
{
  "banner_id": "B001",
  "first_name": "Ava",
  "last_name": "Patel",
  "status": "Placed"
}
```

DB mapping:
- Parse ID via `_parse_record_id`.
- Execute `select(table).where(table.c[pk] == parsed_id)`.

#### POST `/api/{entity}`
- Creates a row from JSON payload.

Body requirements:
- Include valid table columns only.
- For non-auto PK entities, PK field is required.
- For auto PK entities, PK field is ignored if sent.
- Date fields must be `YYYY-MM-DD`.
- Boolean and numeric fields are coerced by backend.

Sample request (students):

```json
{
  "banner_id": "B009999",
  "first_name": "Mira",
  "last_name": "Sen",
  "street": "12 Lake Road",
  "city": "Bhubaneswar",
  "postcode": "751001",
  "dob": "2004-09-11",
  "gender": "Female",
  "category": "Postgraduate",
  "nationality": "Indian",
  "status": "Waiting",
  "major": "Computer Science"
}
```

Sample response `200`:

```json
{
  "banner_id": "B009999",
  "first_name": "Mira",
  "last_name": "Sen",
  "status": "Waiting"
}
```

DB mapping:
- Validate/clean payload via `_sanitize_payload`.
- Execute `insert(table).values(**values)`.
- Commit via `_safe_commit()`.
- Re-query inserted row by PK and return it.

#### PUT `/api/{entity}/{record_id}`
- Updates an existing row by primary key.

Path parameters:
- `record_id` required.

Body rules:
- PK field is ignored for update.
- Must include at least one valid mutable field.

Sample request (halls):

```json
{
  "telephone": "0674-555123"
}
```

Sample response `200`:

```json
{
  "hall_id": 1,
  "hall_name": "Newton Hall",
  "telephone": "0674-555123"
}
```

DB mapping:
- Parse PK using `_parse_record_id`.
- Clean payload with `_sanitize_payload(..., is_update=True)`.
- Execute `update(table).where(pk==id).values(**values)`.
- Commit via `_safe_commit()`.
- Re-query and return updated row.

#### DELETE `/api/{entity}/{record_id}`
- Deletes a row by primary key.

Response:
- `204 No Content`

DB mapping:
- Parse PK.
- Execute `delete(table).where(pk==id)`.
- Commit via `_safe_commit()`.

### 5.3 Entity-wise expected create/update body fields

#### `staff`
Required:
- `first_name`, `last_name`, `email`, `position`, `location`

Optional:
- `street`, `city`, `postcode`, `dob`, `gender`, `department_name`, `internal_phone`, `room_number`

#### `courses`
Required:
- `course_number`, `course_title`, `instructor_name`, `department_name`

Optional:
- `instructor_phone`, `instructor_email`, `instructor_room`

#### `students`
Required:
- `banner_id`, `first_name`, `last_name`, `street`, `city`, `postcode`, `dob`, `gender`, `category`, `nationality`, `status`, `major`

Optional:
- `mobile_phone`, `email`, `special_needs`, `comments`, `minor`, `course_number`, `advisor_staff_id`

#### `halls`
Required:
- `hall_name`, `street`, `city`, `postcode`, `telephone`, `manager_staff_id`

#### `apartments`
Required:
- `street`, `city`, `postcode`, `number_of_bedrooms` (must satisfy schema constraints)

#### `rooms`
Required:
- `place_number`, `room_number`, `monthly_rent`

Optional (but exactly one must be valid in DB trigger logic):
- `hall_id` or `apartment_id`

#### `leases`
Required:
- `banner_id`, `place_number`, `duration_semesters`, `date_enter`

Optional:
- `includes_summer_semester`, `date_leave`

#### `invoices`
Required:
- `lease_id`, `semester`, `amount_due`, `due_date`

Optional:
- `date_paid`, `payment_method`, `first_reminder_date`, `second_reminder_date`

#### `next-of-kin`
Required:
- `banner_id`, `name`, `relationship`, `street`, `city`, `postcode`, `phone`

#### `inspections`
Required:
- `apartment_id`, `staff_id`, `inspection_date`, `is_satisfactory`

Optional:
- `comments`

## 6) Report Endpoints `(a) -> (n)`

All report routes are `GET` and require `admin | manager | viewer` token.

### (a) GET `/api/reports/hall-managers`
Parameters: none.

Sample response:

```json
[
  {
    "hall_id": 1,
    "hall_name": "Newton Hall",
    "manager_name": "Jane Smith",
    "manager_phone": "0674-2100"
  }
]
```

DB mapping:
- Selects from view `v_hall_managers`.

### (b) GET `/api/reports/student-leases`
Parameters: none.

Sample response:

```json
[
  {
    "lease_id": 1,
    "banner_id": "B001",
    "student_name": "Ava Patel",
    "duration_semesters": "Full Academic Year",
    "includes_summer_semester": false,
    "date_enter": "2025-08-15",
    "date_leave": "2026-05-20",
    "place_number": 1001,
    "room_number": "N-101",
    "monthly_rent": 5500.0,
    "residence_type": "Hall",
    "residence_name": "Newton Hall",
    "residence_address": "North Road, Bhubaneswar 751001"
  }
]
```

DB mapping:
- Selects from view `v_student_leases`.

### (c) GET `/api/reports/summer-leases`
Parameters: none.

Sample response:

```json
[
  {
    "lease_id": 7,
    "banner_id": "B0188",
    "student_name": "Neel Roy",
    "includes_summer_semester": true
  }
]
```

DB mapping:
- Selects from view `v_summer_leases`.

### (d) GET `/api/reports/student-rent-paid/{banner_id}`
Path params:
- `banner_id` (string, required)

Sample response:

```json
{
  "banner_id": "B001",
  "student_name": "Ava Patel",
  "total_paid": 16500.0
}
```

DB mapping:
- Selects from view `v_student_rent_paid` with `banner_id` filter.

### (e) GET `/api/reports/unpaid-invoices`
Query params:
- `due_before` (optional, `YYYY-MM-DD`; defaults to current date if omitted)

Sample response:

```json
[
  {
    "invoice_id": 4,
    "lease_id": 11,
    "banner_id": "B009",
    "student_name": "Riya Das",
    "semester": "Spring",
    "amount_due": 7000.0,
    "due_date": "2026-01-20",
    "place_number": 1202,
    "room_number": "A2-R1",
    "residence_type": "Apartment",
    "residence_address": "Park Street, Bhubaneswar 751010"
  }
]
```

DB mapping:
- Selects from view `v_unpaid_invoices` and applies `due_date <= :due_before` filter.

### (f) GET `/api/reports/unsatisfactory-inspections`
Parameters: none.

Sample response:

```json
[
  {
    "inspection_id": 3,
    "inspection_date": "2026-03-04",
    "staff_name": "John Doe",
    "apartment_id": 2,
    "comments": "Plumbing issue"
  }
]
```

DB mapping:
- Selects from view `v_unsatisfactory_inspections`.

### (g) GET `/api/reports/hall-student-rooms/{hall_id}`
Path params:
- `hall_id` (int, required)

Sample response:

```json
[
  {
    "banner_id": "B001",
    "student_name": "Ava Patel",
    "hall_name": "Newton Hall",
    "room_number": "N-101",
    "place_number": 1001
  }
]
```

DB mapping:
- Selects from view `v_hall_student_rooms` with `hall_id` filter.

### (h) GET `/api/reports/waiting-list`
Parameters: none.

Sample response:

```json
[
  {
    "banner_id": "B110",
    "first_name": "Arjun",
    "last_name": "Nayak",
    "status": "Waiting",
    "major": "Data Science"
  }
]
```

DB mapping:
- Selects from view `v_waiting_list`.

### (i) GET `/api/reports/student-category-counts`
Parameters: none.

Sample response:

```json
[
  {
    "category": "Postgraduate",
    "student_count": 12
  },
  {
    "category": "Returning Undergraduate",
    "student_count": 18
  }
]
```

DB mapping:
- Selects from view `v_student_category_counts`.

### (j) GET `/api/reports/students-without-kin`
Parameters: none.

Sample response:

```json
[
  {
    "banner_id": "B721",
    "student_name": "Ira Sen"
  }
]
```

DB mapping:
- Selects from view `v_students_without_kin`.

### (k) GET `/api/reports/student-adviser/{banner_id}`
Path params:
- `banner_id` (string, required)

Sample response:

```json
{
  "banner_id": "B001",
  "student_name": "Ava Patel",
  "adviser_name": "John Doe",
  "adviser_phone": "0674-2001"
}
```

DB mapping:
- Selects from view `v_student_advisers` with `banner_id` filter.

### (l) GET `/api/reports/rent-stats`
Parameters: none.

Sample response:

```json
{
  "min_rent": 4500.0,
  "max_rent": 8500.0,
  "avg_rent": 6125.5
}
```

DB mapping:
- Selects from view `v_hall_rent_stats`.

### (m) GET `/api/reports/hall-place-counts`
Parameters: none.

Sample response:

```json
[
  {
    "hall_id": 1,
    "hall_name": "Newton Hall",
    "total_places": 120
  }
]
```

DB mapping:
- Selects from view `v_hall_place_counts`.

### (n) GET `/api/reports/senior-staff`
Parameters: none.

Sample response:

```json
[
  {
    "staff_id": 9,
    "staff_name": "R. Menon",
    "age": 63,
    "location": "Finance Block"
  }
]
```

DB mapping:
- Selects from view `v_senior_staff`.

## 7) Error Handling and Status Codes

Common status codes:
- `200 OK` successful reads/create/update
- `204 No Content` successful delete
- `400 Bad Request` invalid payload/date/boolean/numeric formats or constraint violations
- `401 Unauthorized` missing/invalid token
- `403 Forbidden` insufficient role
- `404 Not Found` entity/record/report target missing
- `409 Conflict` duplicate key (mapped from MySQL error 1062)
- `500 Internal Server Error` DB connectivity/configuration failures

Common error shape:

```json
{
  "detail": "human-readable error"
}
```

## 8) How FastAPI Routes Connect To Database Work

### CRUD path
1. FastAPI route matches `/api/{entity}` or `/api/{entity}/{record_id}`.
2. `_entity_config()` maps URL entity key to table metadata (`table`, `pk`, `id_type`, `auto_pk`).
3. `get_table()` retrieves reflected SQLAlchemy table object from schema metadata.
4. SQLAlchemy Core executes `select/insert/update/delete` on that table.
5. `_safe_commit()` commits and maps DB-level errors to HTTP errors.

### Report path
1. FastAPI route for `/api/reports/...` calls `_run_report(session, sql, params)`.
2. SQL text query executes directly against MySQL through SQLAlchemy session.
3. Rows are converted with `.mappings().all()` and returned as JSON.
4. Decimal values are normalized by `_encode()`.

## 9) Notes For Frontend Integrators

- Frontend helper `frontend/src/lib/api.ts` sets `Authorization` header automatically when token is present.
- Vite proxy in `frontend/vite.config.ts` forwards `/api`, `/auth`, and `/health` to backend during local development.
