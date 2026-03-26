# API Documentation

Base URL examples:

- Local: `http://localhost:8080`
- Render: `https://<your-service>.onrender.com`

All responses use `application/json`.

## Health Check

### `GET /health`

Use this for uptime probes and deployment checks.

Response:

```json
{
  "service": "uni-accom-api",
  "status": "ok"
}
```

## Students

### `GET /api/students`

Returns all students ordered by `banner_id`.

Response example:

```json
[
  {
    "banner_id": "B001",
    "name": "Alice Johnson",
    "address": "123 Main Street",
    "phone": "9876543210",
    "email": "alice@example.com",
    "dob": "2003-05-10T00:00:00Z",
    "gender": "Female",
    "category": "Undergraduate",
    "nationality": "Indian",
    "status": "Waiting",
    "major": "Computer Science",
    "minor": "Mathematics"
  }
]
```

### `POST /api/students`

Creates a new student record.

Request body:

```json
{
  "banner_id": "B001",
  "name": "Alice Johnson",
  "address": "123 Main Street",
  "phone": "9876543210",
  "email": "alice@example.com",
  "dob": "2003-05-10",
  "gender": "Female",
  "category": "Undergraduate",
  "nationality": "Indian",
  "special_needs": "",
  "comments": "",
  "status": "Waiting",
  "major": "Computer Science",
  "minor": "Mathematics",
  "advisor_staff_id": 1
}
```

Field rules:

- `banner_id`, `name`, `address`, `dob`, `gender`, `category`, `nationality`, `status`, and `major` are required
- `status` must be `Placed` or `Waiting`
- `dob` must use `YYYY-MM-DD`
- `advisor_staff_id` is optional, but if sent it must reference an existing staff row
- empty optional strings are normalized to `null`

Success response:

```json
{
  "banner_id": "B001",
  "name": "Alice Johnson",
  "address": "123 Main Street",
  "phone": "9876543210",
  "email": "alice@example.com",
  "dob": "2003-05-10T00:00:00Z",
  "gender": "Female",
  "category": "Undergraduate",
  "nationality": "Indian",
  "status": "Waiting",
  "major": "Computer Science",
  "minor": "Mathematics",
  "advisor_staff_id": 1
}
```

Error responses:

```json
{
  "error": "invalid student payload"
}
```

```json
{
  "error": "dob must use YYYY-MM-DD format"
}
```

```json
{
  "error": "student with this banner_id already exists"
}
```

```json
{
  "error": "advisor_staff_id does not reference an existing staff member"
}
```

## Reports

### `GET /api/reports/hall-managers`

Returns hall managers and contact numbers.

Response example:

```json
[
  {
    "hall_id": 1,
    "hall_name": "Maple Hall",
    "manager_name": "John Carter",
    "manager_phone": "555-1000"
  }
]
```

### `GET /api/reports/student-leases`

Returns student and lease details with room and residence information.

Response example:

```json
[
  {
    "lease_id": 1,
    "banner_id": "B001",
    "student_name": "Alice Johnson",
    "duration": "Semester 1",
    "date_enter": "2026-01-10T00:00:00Z",
    "date_leave": "2026-05-20T00:00:00Z",
    "place_number": 101,
    "room_number": "A-12",
    "monthly_rent": 4500,
    "residence_type": "Hall",
    "residence_name": "Maple Hall",
    "residence_address": "North Campus"
  }
]
```

### `GET /api/reports/unpaid-invoices`

Returns invoices where `date_paid IS NULL`.

Response example:

```json
[
  {
    "invoice_id": 1,
    "lease_id": 10,
    "banner_id": "B001",
    "student_name": "Alice Johnson",
    "semester": "Semester 1",
    "amount_due": 18000,
    "place_number": 101,
    "room_number": "A-12",
    "residence_type": "Hall",
    "residence_address": "North Campus"
  }
]
```

### `GET /api/reports/rent-stats`

Returns minimum, maximum, and average rent for hall rooms only.

Response example:

```json
{
  "min_rent": 3500,
  "max_rent": 6000,
  "avg_rent": 4550
}
```

If there are no hall rooms yet:

```json
{
  "min_rent": null,
  "max_rent": null,
  "avg_rent": null
}
```

## Frontend Integration Notes

- CORS is enabled for local frontend development
- all write requests should send `Content-Type: application/json`
- timestamps in responses come from Go's JSON encoder and are returned as RFC 3339 strings
- there is no authentication layer in v1, so the frontend can call the endpoints directly
- `GET /api/students/:id` is not exposed yet even though a repository method exists for future use
