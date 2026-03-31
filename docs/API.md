# API Documentation

Base URL examples:

- Local backend: `http://localhost:8000`
- Render: `https://<your-service>.onrender.com`

Content type:

- Request/response body: `application/json`

## Authentication

This API is protected with JWT bearer auth.

### Login

- `POST /auth/login`

Request body:

```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

Response:

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

### Current user profile

- `GET /auth/me`
- Requires: `Authorization: Bearer <token>`

## Health and frontend serving

- `GET /health` -> service health
- `GET /` -> frontend entry page (if `frontend/dist` exists)
- `GET /assets/*` -> frontend build assets
- `GET /{spa-path}` -> SPA fallback for non-API non-auth routes

## Role permissions

- `admin`: read + create + update + delete
- `manager`: read + create + update
- `viewer`: read-only

Applied rules:

- All reads (list/get/report): `admin | manager | viewer`
- Create/update: `admin | manager`
- Delete: `admin` only

## CRUD endpoints

Pattern:

- `GET /api/{module}` -> list records
- `GET /api/{module}/{id}` -> fetch one
- `POST /api/{module}` -> create
- `PUT /api/{module}/{id}` -> update
- `DELETE /api/{module}/{id}` -> delete

### Modules and id fields

- Staff: `/api/staff/{staff_id}` (int)
- Courses: `/api/courses/{course_number}`
- Students: `/api/students/{banner_id}`
- Halls: `/api/halls/{hall_id}` (int)
- Apartments: `/api/apartments/{apartment_id}` (int)
- Rooms: `/api/rooms/{place_number}` (int)
- Leases: `/api/leases/{lease_id}` (int)
- Invoices: `/api/invoices/{invoice_id}` (int)
- Next of kin: `/api/next-of-kin/{kin_id}` (int)
- Inspections: `/api/inspections/{inspection_id}` (int)

## Report endpoints `(a) -> (n)`

All report routes are `GET` and require authenticated read access.

- `(a)` `/api/reports/hall-managers`
- `(b)` `/api/reports/student-leases`
- `(c)` `/api/reports/summer-leases`
- `(d)` `/api/reports/student-rent-paid/{banner_id}`
- `(e)` `/api/reports/unpaid-invoices?due_before=YYYY-MM-DD`
- `(f)` `/api/reports/unsatisfactory-inspections`
- `(g)` `/api/reports/hall-student-rooms/{hall_id}`
- `(h)` `/api/reports/waiting-list`
- `(i)` `/api/reports/student-category-counts`
- `(j)` `/api/reports/students-without-kin`
- `(k)` `/api/reports/student-adviser/{banner_id}`
- `(l)` `/api/reports/rent-stats`
- `(m)` `/api/reports/hall-place-counts`
- `(n)` `/api/reports/senior-staff`

## Input and validation rules

Date fields must use `YYYY-MM-DD`.

For example:

- `dob`
- `date_enter`, `date_leave`
- `due_date`, `date_paid`
- `first_reminder_date`, `second_reminder_date`
- `inspection_date`

The backend also enforces numeric and boolean coercion/validation before DB commit.

## Status codes

- `200 OK` -> successful reads/updates/creates
- `204 No Content` -> successful delete
- `400 Bad Request` -> invalid payload, date format, FK/check validation failure
- `401 Unauthorized` -> missing/invalid bearer token
- `403 Forbidden` -> valid token but insufficient role permissions
- `404 Not Found` -> route or record not found
- `409 Conflict` -> duplicate key
- `500 Internal Server Error` -> DB or server failure

Error response shape:

```json
{
  "detail": "message"
}
```

## Example requests

### Create student

```json
{
  "banner_id": "B001",
  "first_name": "Alice",
  "last_name": "Johnson",
  "street": "123 Main St",
  "city": "Bhubaneswar",
  "postcode": "751024",
  "mobile_phone": "9999999999",
  "email": "alice@example.com",
  "dob": "2003-05-10",
  "gender": "Female",
  "category": "First-year Undergraduate",
  "nationality": "Indian",
  "status": "Waiting",
  "major": "Computer Science",
  "minor": "Math",
  "course_number": "CSE-Y1",
  "advisor_staff_id": 2
}
```

### Create room

```json
{
  "place_number": 4001,
  "room_number": "A-204",
  "monthly_rent": 5200,
  "hall_id": 1,
  "apartment_id": null
}
```

### Create invoice

```json
{
  "lease_id": 10,
  "semester": "Semester 1",
  "amount_due": 18000,
  "due_date": "2026-09-15",
  "payment_method": "UPI"
}
```

## Test coverage references

- Route/auth tests: `backend/tests/test_routes.py`
- Runtime integration smoke checks: `backend/tests/runtime_smoke.py`
