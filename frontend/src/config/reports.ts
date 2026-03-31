import type { ReportDefinition } from "../types";

export const REPORTS: ReportDefinition[] = [
  {
    id: "a",
    title: "Hall Managers",
    description: "List each hall with the currently assigned manager and contact info.",
    endpoint: "/api/reports/hall-managers",
    method: "GET",
    accent: "from-orange-300 to-pink-300"
  },
  {
    id: "b",
    title: "Student Leases",
    description: "All student leases with room and residence details.",
    endpoint: "/api/reports/student-leases",
    method: "GET",
    accent: "from-cyan-300 to-blue-300"
  },
  {
    id: "c",
    title: "Summer Leases",
    description: "Lease records where summer semester is included.",
    endpoint: "/api/reports/summer-leases",
    method: "GET",
    accent: "from-amber-300 to-orange-300"
  },
  {
    id: "d",
    title: "Student Rent Paid",
    description: "Total rent paid by one student by banner ID.",
    endpoint: "/api/reports/student-rent-paid/:banner_id",
    method: "GET",
    accent: "from-rose-300 to-red-300",
    parameters: [{ key: "banner_id", label: "Banner ID", in: "path", type: "text", required: true }]
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
    ]
  },
  {
    id: "f",
    title: "Unsatisfactory Inspections",
    description: "Inspections that were marked unsatisfactory.",
    endpoint: "/api/reports/unsatisfactory-inspections",
    method: "GET",
    accent: "from-fuchsia-300 to-orange-300"
  },
  {
    id: "g",
    title: "Hall Student Rooms",
    description: "Students currently mapped to rooms for a hall.",
    endpoint: "/api/reports/hall-student-rooms/:hall_id",
    method: "GET",
    accent: "from-teal-300 to-cyan-300",
    parameters: [{ key: "hall_id", label: "Hall ID", in: "path", type: "number", required: true }]
  },
  {
    id: "h",
    title: "Waiting List",
    description: "Students currently waiting for placement.",
    endpoint: "/api/reports/waiting-list",
    method: "GET",
    accent: "from-yellow-300 to-amber-300"
  },
  {
    id: "i",
    title: "Category Counts",
    description: "Number of students in each category.",
    endpoint: "/api/reports/student-category-counts",
    method: "GET",
    accent: "from-sky-300 to-cyan-300"
  },
  {
    id: "j",
    title: "Students Without Kin",
    description: "Students missing next-of-kin records.",
    endpoint: "/api/reports/students-without-kin",
    method: "GET",
    accent: "from-orange-300 to-red-300"
  },
  {
    id: "k",
    title: "Student Adviser",
    description: "Student and assigned adviser details by banner ID.",
    endpoint: "/api/reports/student-adviser/:banner_id",
    method: "GET",
    accent: "from-indigo-300 to-cyan-300",
    parameters: [{ key: "banner_id", label: "Banner ID", in: "path", type: "text", required: true }]
  },
  {
    id: "l",
    title: "Rent Stats",
    description: "Minimum, maximum, and average hall rent.",
    endpoint: "/api/reports/rent-stats",
    method: "GET",
    accent: "from-green-300 to-teal-300"
  },
  {
    id: "m",
    title: "Hall Place Counts",
    description: "Total places available per hall.",
    endpoint: "/api/reports/hall-place-counts",
    method: "GET",
    accent: "from-orange-300 to-yellow-300"
  },
  {
    id: "n",
    title: "Senior Staff",
    description: "Staff older than 60 with location details.",
    endpoint: "/api/reports/senior-staff",
    method: "GET",
    accent: "from-cyan-300 to-emerald-300"
  }
];
