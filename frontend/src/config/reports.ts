import type { ReportDefinition } from "../types";

export const REPORTS: ReportDefinition[] = [
  {
    id: "a",
    title: "Hall Managers",
    description: "List each hall with the currently assigned manager and contact info.",
    endpoint: "/api/reports/hall-managers",
    method: "GET",
    accent: "from-orange-300 to-pink-300",
    dbms: {
      objectType: "VIEW",
      objectName: "v_hall_managers",
      workbenchQuery: "SELECT * FROM v_hall_managers ORDER BY hall_id;",
      routeQuery: "SELECT hall_id, hall_name, manager_name, manager_phone FROM v_hall_managers ORDER BY hall_id"
    }
  },
  {
    id: "b",
    title: "Student Leases",
    description: "All student leases with room and residence details.",
    endpoint: "/api/reports/student-leases",
    method: "GET",
    accent: "from-cyan-300 to-blue-300",
    dbms: {
      objectType: "VIEW",
      objectName: "v_student_leases",
      workbenchQuery: "SELECT * FROM v_student_leases ORDER BY banner_id, lease_id;",
      routeQuery:
        "SELECT lease_id, banner_id, student_name, duration_semesters, includes_summer_semester, date_enter, date_leave, place_number, room_number, monthly_rent, residence_type, residence_name, residence_address FROM v_student_leases ORDER BY banner_id, lease_id"
    }
  },
  {
    id: "c",
    title: "Summer Leases",
    description: "Lease records where summer semester is included.",
    endpoint: "/api/reports/summer-leases",
    method: "GET",
    accent: "from-amber-300 to-orange-300",
    dbms: {
      objectType: "VIEW",
      objectName: "v_summer_leases",
      workbenchQuery: "SELECT * FROM v_summer_leases ORDER BY lease_id;",
      routeQuery:
        "SELECT lease_id, banner_id, student_name, duration_semesters, includes_summer_semester, date_enter, date_leave, place_number, room_number, monthly_rent, residence_type, residence_name, residence_address FROM v_summer_leases ORDER BY lease_id"
    }
  },
  {
    id: "d",
    title: "Student Rent Paid",
    description: "Total rent paid by one student by banner ID.",
    endpoint: "/api/reports/student-rent-paid/:banner_id",
    method: "GET",
    accent: "from-rose-300 to-red-300",
    parameters: [{ key: "banner_id", label: "Banner ID", in: "path", type: "text", required: true }],
    dbms: {
      objectType: "VIEW",
      objectName: "v_student_rent_paid",
      workbenchQuery: "SELECT * FROM v_student_rent_paid WHERE banner_id = 'B001';",
      routeQuery: "SELECT banner_id, student_name, total_paid FROM v_student_rent_paid WHERE banner_id = :banner_id"
    }
  },
  {
    id: "e",
    title: "Unpaid Invoices",
    description: "Invoices unpaid up to a selected due date.",
    endpoint: "/api/reports/unpaid-invoices",
    method: "GET",
    accent: "from-lime-300 to-emerald-300",
    parameters: [
      {
        key: "due_before",
        label: "Due before",
        in: "query",
        type: "date",
        required: false,
        placeholder: "YYYY-MM-DD"
      }
    ],
    dbms: {
      objectType: "VIEW",
      objectName: "v_unpaid_invoices",
      workbenchQuery: "SELECT * FROM v_unpaid_invoices WHERE due_date <= '2026-12-31' ORDER BY invoice_id;",
      routeQuery:
        "SELECT invoice_id, lease_id, banner_id, student_name, semester, amount_due, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date, place_number, room_number, residence_type, residence_address FROM v_unpaid_invoices WHERE due_date <= :due_before ORDER BY invoice_id"
    }
  },
  {
    id: "f",
    title: "Unsatisfactory Inspections",
    description: "Inspections that were marked unsatisfactory.",
    endpoint: "/api/reports/unsatisfactory-inspections",
    method: "GET",
    accent: "from-fuchsia-300 to-orange-300",
    dbms: {
      objectType: "VIEW",
      objectName: "v_unsatisfactory_inspections",
      workbenchQuery: "SELECT * FROM v_unsatisfactory_inspections ORDER BY inspection_date DESC;",
      routeQuery:
        "SELECT inspection_id, DATE_FORMAT(inspection_date, '%Y-%m-%d') AS inspection_date, staff_name, apartment_id, comments FROM v_unsatisfactory_inspections ORDER BY inspection_date DESC"
    }
  },
  {
    id: "g",
    title: "Hall Student Rooms",
    description: "Students currently mapped to rooms for a hall.",
    endpoint: "/api/reports/hall-student-rooms/:hall_id",
    method: "GET",
    accent: "from-teal-300 to-cyan-300",
    parameters: [{ key: "hall_id", label: "Hall ID", in: "path", type: "number", required: true }],
    dbms: {
      objectType: "VIEW",
      objectName: "v_hall_student_rooms",
      workbenchQuery: "SELECT * FROM v_hall_student_rooms WHERE hall_id = 1 ORDER BY banner_id;",
      routeQuery:
        "SELECT banner_id, student_name, hall_name, room_number, place_number FROM v_hall_student_rooms WHERE hall_id = :hall_id ORDER BY banner_id"
    }
  },
  {
    id: "h",
    title: "Waiting List",
    description: "Students currently waiting for placement.",
    endpoint: "/api/reports/waiting-list",
    method: "GET",
    accent: "from-yellow-300 to-amber-300",
    dbms: {
      objectType: "VIEW",
      objectName: "v_waiting_list",
      workbenchQuery: "SELECT * FROM v_waiting_list ORDER BY banner_id;",
      routeQuery:
        "SELECT banner_id, first_name, last_name, street, city, postcode, mobile_phone, email, dob, gender, category, nationality, special_needs, comments, status, major, minor, course_number, advisor_staff_id FROM v_waiting_list ORDER BY banner_id"
    }
  },
  {
    id: "i",
    title: "Category Counts",
    description: "Number of students in each category.",
    endpoint: "/api/reports/student-category-counts",
    method: "GET",
    accent: "from-sky-300 to-cyan-300",
    dbms: {
      objectType: "VIEW",
      objectName: "v_student_category_counts",
      workbenchQuery: "SELECT * FROM v_student_category_counts ORDER BY category;",
      routeQuery: "SELECT category, student_count FROM v_student_category_counts ORDER BY category"
    }
  },
  {
    id: "j",
    title: "Students Without Kin",
    description: "Students missing next-of-kin records.",
    endpoint: "/api/reports/students-without-kin",
    method: "GET",
    accent: "from-orange-300 to-red-300",
    dbms: {
      objectType: "VIEW",
      objectName: "v_students_without_kin",
      workbenchQuery: "SELECT * FROM v_students_without_kin ORDER BY banner_id;",
      routeQuery: "SELECT banner_id, student_name FROM v_students_without_kin ORDER BY banner_id"
    }
  },
  {
    id: "k",
    title: "Student Adviser",
    description: "Student and assigned adviser details by banner ID.",
    endpoint: "/api/reports/student-adviser/:banner_id",
    method: "GET",
    accent: "from-indigo-300 to-cyan-300",
    parameters: [{ key: "banner_id", label: "Banner ID", in: "path", type: "text", required: true }],
    dbms: {
      objectType: "VIEW",
      objectName: "v_student_advisers",
      workbenchQuery: "SELECT * FROM v_student_advisers WHERE banner_id = 'B001';",
      routeQuery:
        "SELECT banner_id, student_name, adviser_name, adviser_phone FROM v_student_advisers WHERE banner_id = :banner_id"
    }
  },
  {
    id: "l",
    title: "Rent Stats",
    description: "Minimum, maximum, and average hall rent.",
    endpoint: "/api/reports/rent-stats",
    method: "GET",
    accent: "from-green-300 to-teal-300",
    dbms: {
      objectType: "VIEW",
      objectName: "v_hall_rent_stats",
      workbenchQuery: "SELECT * FROM v_hall_rent_stats;",
      routeQuery: "SELECT min_rent, max_rent, avg_rent FROM v_hall_rent_stats"
    }
  },
  {
    id: "m",
    title: "Hall Place Counts",
    description: "Total places available per hall.",
    endpoint: "/api/reports/hall-place-counts",
    method: "GET",
    accent: "from-orange-300 to-yellow-300",
    dbms: {
      objectType: "VIEW",
      objectName: "v_hall_place_counts",
      workbenchQuery: "SELECT * FROM v_hall_place_counts ORDER BY hall_id;",
      routeQuery: "SELECT hall_id, hall_name, total_places FROM v_hall_place_counts ORDER BY hall_id"
    }
  },
  {
    id: "n",
    title: "Senior Staff",
    description: "Staff older than 60 with location details.",
    endpoint: "/api/reports/senior-staff",
    method: "GET",
    accent: "from-cyan-300 to-emerald-300",
    dbms: {
      objectType: "VIEW",
      objectName: "v_senior_staff",
      workbenchQuery: "SELECT * FROM v_senior_staff ORDER BY age DESC, staff_id;",
      routeQuery: "SELECT staff_id, staff_name, age, location FROM v_senior_staff ORDER BY age DESC, staff_id"
    }
  }
];
