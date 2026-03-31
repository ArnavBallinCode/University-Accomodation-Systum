# API Documentation

Base URL examples:

- Local: `http://localhost:8000`
- Render: `https://<your-service>.onrender.com`

All responses are `application/json`.

## Health and UI

- `GET /health` -> API health check
- `GET /` -> React frontend entry page
- `GET /assets/*` -> built frontend assets
- `GET /{spa-path}` -> SPA fallback route for frontend pages (non-API paths)

## CRUD Endpoints

Each module supports full CRUD:

- `GET /api/{module}` -> list
- `GET /api/{module}/{id}` -> get by id
- `POST /api/{module}` -> create
- `PUT /api/{module}/{id}` -> update
- `DELETE /api/{module}/{id}` -> delete

### Modules and IDs

- Staff: `/api/staff/{id}` where `id` is `staff_id` (int)
- Courses: `/api/courses/{course_number}`
- Students: `/api/students/{banner_id}`
- Halls: `/api/halls/{id}` where `id` is `hall_id` (int)
- Apartments: `/api/apartments/{id}` where `id` is `apartment_id` (int)
- Rooms: `/api/rooms/{place_number}`
- Leases: `/api/leases/{id}` where `id` is `lease_id` (int)
- Invoices: `/api/invoices/{id}` where `id` is `invoice_id` (int)
- Next of kin: `/api/next-of-kin/{id}` where `id` is `kin_id` (int)
- Inspections: `/api/inspections/{id}` where `id` is `inspection_id` (int)

### Date Format for Writes

All input date fields must use `YYYY-MM-DD`:

- `dob`
- `date_enter`
- `date_leave`
- `due_date`
- `date_paid`
- `first_reminder_date`
- `second_reminder_date`
- `inspection_date`

### Common Status Codes

- `200 OK`: successful reads/updates
- `201 Created`: successful create
- `204 No Content`: successful delete
- `400 Bad Request`: invalid payload, date format, or constraint violation
- `404 Not Found`: record does not exist
- `409 Conflict`: duplicate key
- `500 Internal Server Error`: server/database error

Error shape:

```json
{
  "detail": "message"
}
```

## Report Endpoints (Assignment Queries)

- `(a)` `GET /api/reports/hall-managers`
- `(b)` `GET /api/reports/student-leases`
- `(c)` `GET /api/reports/summer-leases`
- `(d)` `GET /api/reports/student-rent-paid/{banner_id}`
- `(e)` `GET /api/reports/unpaid-invoices?due_before=YYYY-MM-DD`
- `(f)` `GET /api/reports/unsatisfactory-inspections`
- `(g)` `GET /api/reports/hall-student-rooms/{hall_id}`
- `(h)` `GET /api/reports/waiting-list`
- `(i)` `GET /api/reports/student-category-counts`
- `(j)` `GET /api/reports/students-without-kin`
- `(k)` `GET /api/reports/student-adviser/{banner_id}`
- `(l)` `GET /api/reports/rent-stats`
- `(m)` `GET /api/reports/hall-place-counts`
- `(n)` `GET /api/reports/senior-staff`

## Example Payloads

### Create Student

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

### Create Room

```json
{
  "place_number": 4001,
  "room_number": "A-204",
  "monthly_rent": 5200,
  "hall_id": 1,
  "apartment_id": null
}
```

### Create Invoice

```json
{
  "lease_id": 10,
  "semester": "Semester 1",
  "amount_due": 18000,
  "due_date": "2026-09-15",
  "payment_method": "UPI"
}
```

## Testing Coverage

Automated Python route checks are available in `backend/tests/test_routes.py` and verify endpoint registration plus health checks.
