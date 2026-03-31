import type { EntityDefinition } from "../types";

export const ENTITIES: EntityDefinition[] = [
  {
    key: "staff",
    label: "Staff",
    endpoint: "/api/staff",
    idKey: "staff_id",
    autoId: true,
    description: "Residence and office personnel managing accommodation operations.",
    accent: "from-orange-300 to-rose-300",
    fields: [
      { key: "first_name", label: "First name", type: "text", required: true },
      { key: "last_name", label: "Last name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "street", label: "Street", type: "text" },
      { key: "city", label: "City", type: "text" },
      { key: "postcode", label: "Postcode", type: "text" },
      { key: "dob", label: "Date of birth", type: "date" },
      {
        key: "gender",
        label: "Gender",
        type: "select",
        options: [
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
          { label: "Other", value: "Other" },
          { label: "Prefer not to say", value: "Prefer not to say" }
        ]
      },
      { key: "position", label: "Position", type: "text", required: true },
      { key: "department_name", label: "Department", type: "text" },
      { key: "internal_phone", label: "Internal phone", type: "text" },
      { key: "room_number", label: "Room number", type: "text" },
      { key: "location", label: "Location", type: "text", required: true }
    ]
  },
  {
    key: "courses",
    label: "Courses",
    endpoint: "/api/courses",
    idKey: "course_number",
    description: "Course catalog used to map students to academic programs.",
    accent: "from-cyan-300 to-sky-300",
    fields: [
      { key: "course_number", label: "Course number", type: "text", required: true },
      { key: "course_title", label: "Course title", type: "text", required: true },
      { key: "instructor_name", label: "Instructor name", type: "text", required: true },
      { key: "instructor_phone", label: "Instructor phone", type: "text" },
      { key: "instructor_email", label: "Instructor email", type: "email" },
      { key: "instructor_room", label: "Instructor room", type: "text" },
      { key: "department_name", label: "Department", type: "text", required: true }
    ]
  },
  {
    key: "students",
    label: "Students",
    endpoint: "/api/students",
    idKey: "banner_id",
    description: "Student records including contact, academic and accommodation status.",
    accent: "from-amber-300 to-orange-300",
    fields: [
      { key: "banner_id", label: "Banner ID", type: "text", required: true },
      { key: "first_name", label: "First name", type: "text", required: true },
      { key: "last_name", label: "Last name", type: "text", required: true },
      { key: "street", label: "Street", type: "text", required: true },
      { key: "city", label: "City", type: "text", required: true },
      { key: "postcode", label: "Postcode", type: "text", required: true },
      { key: "mobile_phone", label: "Mobile phone", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "dob", label: "Date of birth", type: "date", required: true },
      {
        key: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
          { label: "Male", value: "Male" },
          { label: "Female", value: "Female" },
          { label: "Other", value: "Other" }
        ]
      },
      {
        key: "category",
        label: "Category",
        type: "select",
        required: true,
        options: [
          { label: "First-year Undergraduate", value: "First-year Undergraduate" },
          { label: "Returning Undergraduate", value: "Returning Undergraduate" },
          { label: "Postgraduate", value: "Postgraduate" },
          { label: "Visiting", value: "Visiting" }
        ]
      },
      { key: "nationality", label: "Nationality", type: "text", required: true },
      { key: "special_needs", label: "Special needs", type: "textarea" },
      { key: "comments", label: "Comments", type: "textarea" },
      {
        key: "status",
        label: "Status",
        type: "select",
        required: true,
        options: [
          { label: "Placed", value: "Placed" },
          { label: "Waiting", value: "Waiting" }
        ]
      },
      { key: "major", label: "Major", type: "text", required: true },
      { key: "minor", label: "Minor", type: "text" },
      { key: "course_number", label: "Course number", type: "text" },
      { key: "advisor_staff_id", label: "Adviser staff ID", type: "number" }
    ]
  },
  {
    key: "halls",
    label: "Halls",
    endpoint: "/api/halls",
    idKey: "hall_id",
    autoId: true,
    description: "Residence halls and assigned hall managers.",
    accent: "from-teal-300 to-cyan-300",
    fields: [
      { key: "hall_name", label: "Hall name", type: "text", required: true },
      { key: "street", label: "Street", type: "text", required: true },
      { key: "city", label: "City", type: "text", required: true },
      { key: "postcode", label: "Postcode", type: "text", required: true },
      { key: "telephone", label: "Telephone", type: "text", required: true },
      { key: "manager_staff_id", label: "Manager staff ID", type: "number", required: true }
    ]
  },
  {
    key: "apartments",
    label: "Apartments",
    endpoint: "/api/apartments",
    idKey: "apartment_id",
    autoId: true,
    description: "Apartment blocks with bedroom capacities.",
    accent: "from-lime-300 to-emerald-300",
    fields: [
      { key: "street", label: "Street", type: "text", required: true },
      { key: "city", label: "City", type: "text", required: true },
      { key: "postcode", label: "Postcode", type: "text", required: true },
      {
        key: "number_of_bedrooms",
        label: "Bedrooms",
        type: "select",
        required: true,
        options: [
          { label: "3", value: "3" },
          { label: "4", value: "4" },
          { label: "5", value: "5" }
        ]
      }
    ]
  },
  {
    key: "rooms",
    label: "Rooms",
    endpoint: "/api/rooms",
    idKey: "place_number",
    description: "Individual places mapped to exactly one hall or apartment.",
    accent: "from-yellow-300 to-orange-300",
    fields: [
      { key: "place_number", label: "Place number", type: "number", required: true },
      { key: "room_number", label: "Room number", type: "text", required: true },
      { key: "monthly_rent", label: "Monthly rent", type: "number", required: true },
      { key: "hall_id", label: "Hall ID", type: "number", nullable: true },
      { key: "apartment_id", label: "Apartment ID", type: "number", nullable: true }
    ]
  },
  {
    key: "leases",
    label: "Leases",
    endpoint: "/api/leases",
    idKey: "lease_id",
    autoId: true,
    description: "Lease assignments connecting students to accommodation places.",
    accent: "from-rose-300 to-orange-300",
    fields: [
      { key: "banner_id", label: "Banner ID", type: "text", required: true },
      { key: "place_number", label: "Place number", type: "number", required: true },
      { key: "duration_semesters", label: "Duration semesters", type: "text", required: true },
      { key: "includes_summer_semester", label: "Includes summer", type: "boolean", required: true },
      { key: "date_enter", label: "Date enter", type: "date", required: true },
      { key: "date_leave", label: "Date leave", type: "date" }
    ]
  },
  {
    key: "invoices",
    label: "Invoices",
    endpoint: "/api/invoices",
    idKey: "invoice_id",
    autoId: true,
    description: "Rent invoices and payment/reminder tracking.",
    accent: "from-cyan-300 to-indigo-300",
    fields: [
      { key: "lease_id", label: "Lease ID", type: "number", required: true },
      { key: "semester", label: "Semester", type: "text", required: true },
      { key: "amount_due", label: "Amount due", type: "number", required: true },
      { key: "due_date", label: "Due date", type: "date", required: true },
      { key: "date_paid", label: "Date paid", type: "date" },
      { key: "payment_method", label: "Payment method", type: "text" },
      { key: "first_reminder_date", label: "First reminder date", type: "date" },
      { key: "second_reminder_date", label: "Second reminder date", type: "date" }
    ]
  },
  {
    key: "next-of-kin",
    label: "Next of Kin",
    endpoint: "/api/next-of-kin",
    idKey: "kin_id",
    autoId: true,
    description: "Emergency contact information per student.",
    accent: "from-fuchsia-300 to-pink-300",
    fields: [
      { key: "banner_id", label: "Banner ID", type: "text", required: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "relationship", label: "Relationship", type: "text", required: true },
      { key: "street", label: "Street", type: "text", required: true },
      { key: "city", label: "City", type: "text", required: true },
      { key: "postcode", label: "Postcode", type: "text", required: true },
      { key: "phone", label: "Phone", type: "text", required: true }
    ]
  },
  {
    key: "inspections",
    label: "Inspections",
    endpoint: "/api/inspections",
    idKey: "inspection_id",
    autoId: true,
    description: "Apartment inspection records and quality assessments.",
    accent: "from-violet-300 to-cyan-300",
    fields: [
      { key: "apartment_id", label: "Apartment ID", type: "number", required: true },
      { key: "staff_id", label: "Staff ID", type: "number", required: true },
      { key: "inspection_date", label: "Inspection date", type: "date", required: true },
      { key: "is_satisfactory", label: "Satisfactory", type: "boolean", required: true },
      { key: "comments", label: "Comments", type: "textarea" }
    ]
  }
];

export const ENTITY_MAP = Object.fromEntries(ENTITIES.map((entity) => [entity.key, entity]));
