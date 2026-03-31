const ENTITY_CONFIG = {
  staff: {
    label: "Staff",
    endpoint: "/api/staff",
    idField: "staff_id",
    autoId: true,
    fields: [
      { key: "first_name", label: "First Name", type: "text", required: true },
      { key: "last_name", label: "Last Name", type: "text", required: true },
      { key: "email", label: "Email", type: "email", required: true },
      { key: "street", label: "Street", type: "text" },
      { key: "city", label: "City", type: "text" },
      { key: "postcode", label: "Postcode", type: "text" },
      { key: "dob", label: "Date of Birth", type: "date" },
      {
        key: "gender",
        label: "Gender",
        type: "select",
        options: ["Female", "Male", "Other"]
      },
      { key: "position", label: "Position", type: "text", required: true },
      { key: "department_name", label: "Department", type: "text" },
      { key: "internal_phone", label: "Internal Phone", type: "text" },
      { key: "room_number", label: "Room Number", type: "text" },
      { key: "location", label: "Location", type: "text", required: true }
    ]
  },
  courses: {
    label: "Courses",
    endpoint: "/api/courses",
    idField: "course_number",
    autoId: false,
    fields: [
      {
        key: "course_number",
        label: "Course Number",
        type: "text",
        required: true,
        readOnlyOnEdit: true
      },
      { key: "course_title", label: "Course Title", type: "text", required: true, full: true },
      { key: "instructor_name", label: "Instructor Name", type: "text", required: true },
      { key: "instructor_phone", label: "Instructor Phone", type: "text" },
      { key: "instructor_email", label: "Instructor Email", type: "email" },
      { key: "instructor_room", label: "Instructor Room", type: "text" },
      { key: "department_name", label: "Department", type: "text", required: true }
    ]
  },
  students: {
    label: "Students",
    endpoint: "/api/students",
    idField: "banner_id",
    autoId: false,
    fields: [
      {
        key: "banner_id",
        label: "Banner ID",
        type: "text",
        required: true,
        readOnlyOnEdit: true
      },
      { key: "first_name", label: "First Name", type: "text", required: true },
      { key: "last_name", label: "Last Name", type: "text", required: true },
      { key: "street", label: "Street", type: "text", required: true },
      { key: "city", label: "City", type: "text", required: true },
      { key: "postcode", label: "Postcode", type: "text", required: true },
      { key: "mobile_phone", label: "Mobile Phone", type: "text" },
      { key: "email", label: "Email", type: "email" },
      { key: "dob", label: "Date of Birth", type: "date", required: true },
      {
        key: "gender",
        label: "Gender",
        type: "select",
        options: ["Female", "Male", "Other"],
        required: true
      },
      { key: "category", label: "Category", type: "text", required: true },
      { key: "nationality", label: "Nationality", type: "text", required: true },
      {
        key: "status",
        label: "Status",
        type: "select",
        options: ["Placed", "Waiting"],
        required: true
      },
      { key: "major", label: "Major", type: "text", required: true },
      { key: "minor", label: "Minor", type: "text" },
      { key: "course_number", label: "Course Number", type: "text" },
      {
        key: "advisor_staff_id",
        label: "Adviser Staff ID",
        type: "number",
        numberKind: "int"
      },
      { key: "special_needs", label: "Special Needs", type: "textarea", full: true },
      { key: "comments", label: "Comments", type: "textarea", full: true }
    ]
  },
  halls: {
    label: "Halls",
    endpoint: "/api/halls",
    idField: "hall_id",
    autoId: true,
    fields: [
      { key: "hall_name", label: "Hall Name", type: "text", required: true },
      { key: "street", label: "Street", type: "text", required: true },
      { key: "city", label: "City", type: "text", required: true },
      { key: "postcode", label: "Postcode", type: "text", required: true },
      { key: "telephone", label: "Telephone", type: "text", required: true },
      {
        key: "manager_staff_id",
        label: "Manager Staff ID",
        type: "number",
        numberKind: "int",
        required: true
      }
    ]
  },
  apartments: {
    label: "Apartments",
    endpoint: "/api/apartments",
    idField: "apartment_id",
    autoId: true,
    fields: [
      { key: "street", label: "Street", type: "text", required: true },
      { key: "city", label: "City", type: "text", required: true },
      { key: "postcode", label: "Postcode", type: "text", required: true },
      {
        key: "number_of_bedrooms",
        label: "Bedrooms (3/4/5)",
        type: "number",
        numberKind: "int",
        required: true
      }
    ]
  },
  rooms: {
    label: "Rooms",
    endpoint: "/api/rooms",
    idField: "place_number",
    autoId: false,
    fields: [
      {
        key: "place_number",
        label: "Place Number",
        type: "number",
        numberKind: "int",
        required: true,
        readOnlyOnEdit: true
      },
      { key: "room_number", label: "Room Number", type: "text", required: true },
      {
        key: "monthly_rent",
        label: "Monthly Rent",
        type: "number",
        numberKind: "float",
        required: true
      },
      { key: "hall_id", label: "Hall ID", type: "number", numberKind: "int" },
      {
        key: "apartment_id",
        label: "Apartment ID",
        type: "number",
        numberKind: "int"
      }
    ]
  },
  leases: {
    label: "Leases",
    endpoint: "/api/leases",
    idField: "lease_id",
    autoId: true,
    fields: [
      { key: "banner_id", label: "Banner ID", type: "text", required: true },
      {
        key: "place_number",
        label: "Place Number",
        type: "number",
        numberKind: "int",
        required: true
      },
      {
        key: "duration_semesters",
        label: "Duration Semesters",
        type: "text",
        required: true
      },
      {
        key: "includes_summer_semester",
        label: "Includes Summer Semester",
        type: "checkbox"
      },
      { key: "date_enter", label: "Entry Date", type: "date", required: true },
      { key: "date_leave", label: "Leave Date", type: "date" }
    ]
  },
  invoices: {
    label: "Invoices",
    endpoint: "/api/invoices",
    idField: "invoice_id",
    autoId: true,
    fields: [
      { key: "lease_id", label: "Lease ID", type: "number", numberKind: "int", required: true },
      { key: "semester", label: "Semester", type: "text", required: true },
      {
        key: "amount_due",
        label: "Amount Due",
        type: "number",
        numberKind: "float",
        required: true
      },
      { key: "due_date", label: "Due Date", type: "date", required: true },
      { key: "date_paid", label: "Date Paid", type: "date" },
      {
        key: "payment_method",
        label: "Payment Method",
        type: "select",
        options: ["", "Cash", "Check", "Visa", "MasterCard", "UPI", "BankTransfer", "Other"]
      },
      { key: "first_reminder_date", label: "First Reminder", type: "date" },
      { key: "second_reminder_date", label: "Second Reminder", type: "date" }
    ]
  },
  nextofkin: {
    label: "Next Of Kin",
    endpoint: "/api/next-of-kin",
    idField: "kin_id",
    autoId: true,
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
  inspections: {
    label: "Inspections",
    endpoint: "/api/inspections",
    idField: "inspection_id",
    autoId: true,
    fields: [
      {
        key: "apartment_id",
        label: "Apartment ID",
        type: "number",
        numberKind: "int",
        required: true
      },
      {
        key: "staff_id",
        label: "Staff ID",
        type: "number",
        numberKind: "int",
        required: true
      },
      { key: "inspection_date", label: "Inspection Date", type: "date", required: true },
      { key: "is_satisfactory", label: "Is Satisfactory", type: "checkbox" },
      { key: "comments", label: "Comments", type: "textarea", full: true }
    ]
  }
};

const REPORT_CONFIG = [
  {
    key: "hall-managers",
    title: "(a) Hall Managers",
    description: "Manager name and internal phone for each hall.",
    endpoint: "/api/reports/hall-managers"
  },
  {
    key: "student-leases",
    title: "(b) Student Lease Details",
    description: "Students with lease and room information.",
    endpoint: "/api/reports/student-leases"
  },
  {
    key: "summer-leases",
    title: "(c) Summer Semester Leases",
    description: "Leases that include the summer semester.",
    endpoint: "/api/reports/summer-leases"
  },
  {
    key: "student-rent-paid",
    title: "(d) Total Rent Paid",
    description: "Total paid rent for one student.",
    endpoint: "/api/reports/student-rent-paid/:banner_id",
    pathParams: [{ key: "banner_id", label: "Banner ID" }]
  },
  {
    key: "unpaid-invoices",
    title: "(e) Unpaid Invoices By Date",
    description: "Students with unpaid invoices before a date.",
    endpoint: "/api/reports/unpaid-invoices",
    queryParams: [{ key: "due_before", label: "Due Before", type: "date", defaultValue: todayDate() }]
  },
  {
    key: "unsatisfactory-inspections",
    title: "(f) Unsatisfactory Inspections",
    description: "Inspections where property was unsatisfactory.",
    endpoint: "/api/reports/unsatisfactory-inspections"
  },
  {
    key: "hall-student-rooms",
    title: "(g) Hall Student Rooms",
    description: "Students and room/place numbers in a hall.",
    endpoint: "/api/reports/hall-student-rooms/:hall_id",
    pathParams: [{ key: "hall_id", label: "Hall ID", type: "number" }]
  },
  {
    key: "waiting-list",
    title: "(h) Waiting List",
    description: "All students currently waiting for accommodation.",
    endpoint: "/api/reports/waiting-list"
  },
  {
    key: "student-category-counts",
    title: "(i) Student Category Counts",
    description: "Total students in each category.",
    endpoint: "/api/reports/student-category-counts"
  },
  {
    key: "students-without-kin",
    title: "(j) Students Without Next Of Kin",
    description: "Students who have not supplied kin details.",
    endpoint: "/api/reports/students-without-kin"
  },
  {
    key: "student-adviser",
    title: "(k) Adviser For Student",
    description: "Adviser name and internal phone by banner ID.",
    endpoint: "/api/reports/student-adviser/:banner_id",
    pathParams: [{ key: "banner_id", label: "Banner ID" }]
  },
  {
    key: "rent-stats",
    title: "(l) Hall Rent Statistics",
    description: "Minimum, maximum, and average hall room rent.",
    endpoint: "/api/reports/rent-stats"
  },
  {
    key: "hall-place-counts",
    title: "(m) Hall Place Counts",
    description: "Total room places in each hall.",
    endpoint: "/api/reports/hall-place-counts"
  },
  {
    key: "senior-staff",
    title: "(n) Senior Staff 60+",
    description: "Staff over 60 with age and location.",
    endpoint: "/api/reports/senior-staff"
  }
];

const state = {
  activeEntityKey: "staff",
  editingId: null,
  entityRows: [],
  fieldElements: {}
};

const API_BASE =
  window.location.port === "8000"
    ? ""
    : (window.localStorage.getItem("apiBase") || "http://localhost:8000").replace(/\/$/, "");

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

const navEl = document.getElementById("entity-nav");
const formEl = document.getElementById("entity-form");
const titleEl = document.getElementById("active-entity-title");
const tableWrapEl = document.getElementById("table-wrap");
const refreshBtn = document.getElementById("refresh-btn");
const resetFormBtn = document.getElementById("reset-form-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const toastEl = document.getElementById("toast");
const reportsGridEl = document.getElementById("reports-grid");
const reportTitleEl = document.getElementById("report-title");
const reportJsonEl = document.getElementById("report-json");

initialize();

function initialize() {
  buildEntityNav();
  buildReportCards();
  bindEvents();
  setEntity("staff");
}

function bindEvents() {
  refreshBtn.addEventListener("click", () => loadEntityRows());
  resetFormBtn.addEventListener("click", () => resetForm());
  cancelEditBtn.addEventListener("click", () => {
    state.editingId = null;
    cancelEditBtn.classList.add("hidden");
    resetForm();
  });

  formEl.addEventListener("submit", async (event) => {
    event.preventDefault();

    const config = ENTITY_CONFIG[state.activeEntityKey];
    const payload = collectPayload(config);
    if (!payload.ok) {
      showToast(payload.message, true);
      return;
    }

    const method = state.editingId == null ? "POST" : "PUT";
    const endpoint =
      state.editingId == null
        ? config.endpoint
        : `${config.endpoint}/${encodeURIComponent(String(state.editingId))}`;

    try {
      const response = await fetch(apiUrl(endpoint), {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload.value)
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((data && (data.error || data.detail)) || "Request failed");
      }

      const verb = method === "POST" ? "created" : "updated";
      showToast(`${config.label} record ${verb} successfully.`);
      state.editingId = null;
      cancelEditBtn.classList.add("hidden");
      resetForm();
      await loadEntityRows();
    } catch (error) {
      showToast(error.message || "Failed to save record.", true);
    }
  });
}

function buildEntityNav() {
  navEl.innerHTML = "";
  Object.entries(ENTITY_CONFIG).forEach(([key, config]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = config.label;
    button.addEventListener("click", () => setEntity(key));
    button.dataset.entityKey = key;
    navEl.appendChild(button);
  });
}

function setEntity(entityKey) {
  state.activeEntityKey = entityKey;
  state.editingId = null;
  cancelEditBtn.classList.add("hidden");

  [...navEl.querySelectorAll("button")].forEach((button) => {
    button.classList.toggle("active", button.dataset.entityKey === entityKey);
  });

  renderEntityForm();
  loadEntityRows();
}

function renderEntityForm() {
  const config = ENTITY_CONFIG[state.activeEntityKey];
  titleEl.textContent = `${config.label} CRUD`;
  formEl.innerHTML = "";
  state.fieldElements = {};

  config.fields.forEach((field) => {
    if (config.autoId && field.key === config.idField) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = `field ${field.full ? "full" : ""}`.trim();

    if (field.type === "checkbox") {
      wrapper.classList.add("checkbox");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `field-${field.key}`;

      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.textContent = field.label;

      wrapper.appendChild(input);
      wrapper.appendChild(label);
      state.fieldElements[field.key] = input;
      formEl.appendChild(wrapper);
      return;
    }

    const label = document.createElement("label");
    label.textContent = field.label;

    let input;
    if (field.type === "textarea") {
      input = document.createElement("textarea");
    } else if (field.type === "select") {
      input = document.createElement("select");
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "Select";
      input.appendChild(emptyOption);
      (field.options || []).forEach((optionValue) => {
        if (optionValue === "") {
          return;
        }
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue;
        input.appendChild(option);
      });
    } else {
      input = document.createElement("input");
      input.type = field.type === "number" ? "number" : field.type;
      if (field.type === "number") {
        input.step = field.numberKind === "int" ? "1" : "0.01";
      }
    }

    input.id = `field-${field.key}`;
    input.name = field.key;
    if (field.required) {
      input.required = true;
    }

    label.htmlFor = input.id;
    wrapper.appendChild(label);
    wrapper.appendChild(input);
    formEl.appendChild(wrapper);
    state.fieldElements[field.key] = input;
  });
}

async function loadEntityRows() {
  const config = ENTITY_CONFIG[state.activeEntityKey];
  try {
    const response = await fetch(apiUrl(config.endpoint));
    const data = await response.json();
    if (!response.ok) {
      throw new Error((data && (data.error || data.detail)) || "Failed to load rows");
    }

    state.entityRows = Array.isArray(data) ? data : [];
    renderTable(config);
  } catch (error) {
    showToast(error.message || "Failed to fetch data.", true);
    state.entityRows = [];
    renderTable(config);
  }
}

function renderTable(config) {
  if (state.entityRows.length === 0) {
    tableWrapEl.innerHTML = "<p style='padding:0.8rem'>No records found yet.</p>";
    return;
  }

  const columns = buildColumns(config);
  const thead = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join("");

  const rows = state.entityRows
    .map((row) => {
      const cells = columns
        .map((column) => `<td>${formatCell(row[column.key])}</td>`)
        .join("");
      const rowId = row[config.idField];
      return `
        <tr>
          ${cells}
          <td>
            <div class="table-actions">
              <button class="action-btn" data-action="edit" data-id="${escapeHtml(String(rowId))}">Edit</button>
              <button class="action-btn warn" data-action="delete" data-id="${escapeHtml(String(rowId))}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  tableWrapEl.innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          ${thead}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;

  tableWrapEl.querySelectorAll("button[data-action='edit']").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const record = state.entityRows.find(
        (item) => String(item[config.idField]) === String(id)
      );
      if (!record) {
        return;
      }
      beginEdit(config, record);
    });
  });

  tableWrapEl.querySelectorAll("button[data-action='delete']").forEach((button) => {
    button.addEventListener("click", async () => {
      const id = button.dataset.id;
      await deleteRecord(config, id);
    });
  });
}

function buildColumns(config) {
  const columns = [];
  columns.push({ key: config.idField, label: humanize(config.idField) });

  config.fields.forEach((field) => {
    if (field.key === config.idField) {
      return;
    }
    columns.push({ key: field.key, label: field.label });
  });

  return columns;
}

function beginEdit(config, record) {
  state.editingId = record[config.idField];
  cancelEditBtn.classList.remove("hidden");

  config.fields.forEach((field) => {
    if (config.autoId && field.key === config.idField) {
      return;
    }

    const input = state.fieldElements[field.key];
    if (!input) {
      return;
    }

    const value = record[field.key];

    if (field.type === "checkbox") {
      input.checked = Boolean(value);
    } else if (field.type === "date") {
      input.value = formatDateInput(value);
    } else {
      input.value = value == null ? "" : String(value);
    }

    if (field.readOnlyOnEdit) {
      input.disabled = true;
    }
  });

  showToast(`Editing ${config.label} #${state.editingId}`);
}

function resetForm() {
  const config = ENTITY_CONFIG[state.activeEntityKey];
  formEl.reset();
  Object.entries(state.fieldElements).forEach(([key, input]) => {
    const field = config.fields.find((item) => item.key === key);
    if (field && field.readOnlyOnEdit) {
      input.disabled = false;
    }
  });
}

async function deleteRecord(config, id) {
  if (!window.confirm(`Delete this ${config.label} record?`)) {
    return;
  }

  try {
    const response = await fetch(apiUrl(`${config.endpoint}/${encodeURIComponent(String(id))}`), {
      method: "DELETE"
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error((data && (data.error || data.detail)) || "Delete failed");
    }

    showToast(`${config.label} record deleted.`);
    if (state.editingId != null && String(state.editingId) === String(id)) {
      state.editingId = null;
      cancelEditBtn.classList.add("hidden");
      resetForm();
    }
    await loadEntityRows();
  } catch (error) {
    showToast(error.message || "Delete request failed.", true);
  }
}

function collectPayload(config) {
  const payload = {};

  for (const field of config.fields) {
    if (config.autoId && field.key === config.idField) {
      continue;
    }

    const input = state.fieldElements[field.key];
    if (!input) {
      continue;
    }

    if (field.type === "checkbox") {
      payload[field.key] = Boolean(input.checked);
      continue;
    }

    const raw = String(input.value || "").trim();

    if (raw === "") {
      if (field.required) {
        return { ok: false, message: `${field.label} is required.` };
      }
      payload[field.key] = null;
      continue;
    }

    if (field.type === "number") {
      const numeric = Number(raw);
      if (Number.isNaN(numeric)) {
        return { ok: false, message: `${field.label} must be numeric.` };
      }

      payload[field.key] = field.numberKind === "int" ? Math.trunc(numeric) : numeric;
      continue;
    }

    payload[field.key] = raw;
  }

  return { ok: true, value: payload };
}

function buildReportCards() {
  reportsGridEl.innerHTML = "";
  REPORT_CONFIG.forEach((report) => {
    const card = document.createElement("article");
    card.className = "report-card";

    const title = document.createElement("h4");
    title.textContent = report.title;

    const description = document.createElement("p");
    description.textContent = report.description;

    const inputWrap = document.createElement("div");
    inputWrap.className = "inputs";
    const inputMap = {};

    [...(report.pathParams || []), ...(report.queryParams || [])].forEach((param) => {
      const input = document.createElement("input");
      input.type = param.type || "text";
      input.placeholder = param.label;
      input.value = param.defaultValue || "";
      inputMap[param.key] = input;
      inputWrap.appendChild(input);
    });

    const runBtn = document.createElement("button");
    runBtn.type = "button";
    runBtn.className = "cta-btn";
    runBtn.textContent = "Run Query";
    runBtn.addEventListener("click", () => runReport(report, inputMap));

    card.appendChild(title);
    card.appendChild(description);
    if (Object.keys(inputMap).length > 0) {
      card.appendChild(inputWrap);
    }
    card.appendChild(runBtn);

    reportsGridEl.appendChild(card);
  });
}

async function runReport(report, inputMap) {
  let endpoint = report.endpoint;

  if (report.pathParams) {
    for (const param of report.pathParams) {
      const value = String(inputMap[param.key]?.value || "").trim();
      if (!value) {
        showToast(`${param.label} is required for this report.`, true);
        return;
      }
      endpoint = endpoint.replace(`:${param.key}`, encodeURIComponent(value));
    }
  }

  const query = new URLSearchParams();
  if (report.queryParams) {
    for (const param of report.queryParams) {
      const value = String(inputMap[param.key]?.value || "").trim();
      if (value) {
        query.set(param.key, value);
      }
    }
  }

  if ([...query.keys()].length > 0) {
    endpoint = `${endpoint}?${query.toString()}`;
  }

  try {
    const response = await fetch(apiUrl(endpoint));
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error((data && (data.error || data.detail)) || "Report query failed");
    }

    reportTitleEl.textContent = report.title;
    reportJsonEl.textContent = JSON.stringify(data, null, 2);
    showToast(`${report.title} loaded.`);
  } catch (error) {
    showToast(error.message || "Failed to run report.", true);
    reportTitleEl.textContent = report.title;
    reportJsonEl.textContent = "Query failed.";
  }
}

function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.style.background = isError ? "#5d1f1f" : "#15212e";
  toastEl.classList.add("show");

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2600);
}

function formatCell(value) {
  if (value == null) {
    return "<span style='color:#8a939d'>-</span>";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    return escapeHtml(String(value));
  }

  if (typeof value === "string") {
    const text = value.includes("T") && value.length >= 10 ? value.slice(0, 10) : value;
    return escapeHtml(text);
  }

  return escapeHtml(JSON.stringify(value));
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateInput(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return "";
}

function humanize(key) {
  return key.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}
