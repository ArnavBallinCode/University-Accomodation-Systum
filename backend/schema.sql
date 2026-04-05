SET NAMES utf8mb4;

DROP TABLE IF EXISTS inspections;
DROP TABLE IF EXISTS next_of_kin;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS leases;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS apartments;
DROP TABLE IF EXISTS halls;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS staff;

CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    street VARCHAR(255),
    city VARCHAR(100),
    postcode VARCHAR(20),
    dob DATE,
    gender VARCHAR(20),
    position VARCHAR(100) NOT NULL,
    department_name VARCHAR(150),
    internal_phone VARCHAR(30),
    room_number VARCHAR(30),
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
    course_number VARCHAR(30) PRIMARY KEY,
    course_title VARCHAR(255) NOT NULL,
    instructor_name VARCHAR(150) NOT NULL,
    instructor_phone VARCHAR(30),
    instructor_email VARCHAR(255),
    instructor_room VARCHAR(30),
    department_name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE students (
    banner_id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    mobile_phone VARCHAR(30),
    email VARCHAR(255),
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    special_needs TEXT,
    comments TEXT,
    status ENUM('Placed', 'Waiting') NOT NULL,
    major VARCHAR(120) NOT NULL,
    minor VARCHAR(120),
    course_number VARCHAR(30),
    advisor_staff_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_course
        FOREIGN KEY (course_number) REFERENCES courses(course_number)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_students_advisor
        FOREIGN KEY (advisor_staff_id) REFERENCES staff(staff_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_category ON students(category);
CREATE INDEX idx_students_advisor_staff_id ON students(advisor_staff_id);

CREATE TABLE halls (
    hall_id INT AUTO_INCREMENT PRIMARY KEY,
    hall_name VARCHAR(150) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    manager_staff_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_halls_manager
        FOREIGN KEY (manager_staff_id) REFERENCES staff(staff_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_halls_manager_id ON halls(manager_staff_id);

CREATE TABLE apartments (
    apartment_id INT AUTO_INCREMENT PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    number_of_bedrooms INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_apartments_number_of_bedrooms CHECK (number_of_bedrooms IN (3, 4, 5))
);

CREATE TABLE rooms (
    place_number INT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    hall_id INT,
    apartment_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rooms_monthly_rent CHECK (monthly_rent >= 0),
    CONSTRAINT fk_rooms_hall
        FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_rooms_apartment
        FOREIGN KEY (apartment_id) REFERENCES apartments(apartment_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_rooms_hall_id ON rooms(hall_id);
CREATE INDEX idx_rooms_apartment_id ON rooms(apartment_id);

DELIMITER //

CREATE TRIGGER trg_rooms_before_insert
BEFORE INSERT ON rooms
FOR EACH ROW
BEGIN
    IF (NEW.hall_id IS NULL AND NEW.apartment_id IS NULL)
        OR (NEW.hall_id IS NOT NULL AND NEW.apartment_id IS NOT NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A room must belong to exactly one of hall_id or apartment_id.';
    END IF;
END//

CREATE TRIGGER trg_rooms_before_update
BEFORE UPDATE ON rooms
FOR EACH ROW
BEGIN
    IF (NEW.hall_id IS NULL AND NEW.apartment_id IS NULL)
        OR (NEW.hall_id IS NOT NULL AND NEW.apartment_id IS NOT NULL) THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'A room must belong to exactly one of hall_id or apartment_id.';
    END IF;
END//

DELIMITER ;

CREATE TABLE leases (
    lease_id INT AUTO_INCREMENT PRIMARY KEY,
    banner_id VARCHAR(20) NOT NULL,
    place_number INT NOT NULL,
    duration_semesters VARCHAR(60) NOT NULL,
    includes_summer_semester BOOLEAN NOT NULL DEFAULT FALSE,
    date_enter DATE NOT NULL,
    date_leave DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_leases_student
        FOREIGN KEY (banner_id) REFERENCES students(banner_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_leases_room
        FOREIGN KEY (place_number) REFERENCES rooms(place_number)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_leases_banner_id ON leases(banner_id);
CREATE INDEX idx_leases_place_number ON leases(place_number);
CREATE INDEX idx_leases_summer ON leases(includes_summer_semester);

CREATE TABLE invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    semester VARCHAR(30) NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    date_paid DATE,
    payment_method VARCHAR(50),
    first_reminder_date DATE,
    second_reminder_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_invoices_amount_due CHECK (amount_due >= 0),
    CONSTRAINT fk_invoices_lease
        FOREIGN KEY (lease_id) REFERENCES leases(lease_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_invoices_lease_id ON invoices(lease_id);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_date_paid ON invoices(date_paid);

CREATE TABLE next_of_kin (
    kin_id INT AUTO_INCREMENT PRIMARY KEY,
    banner_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_next_of_kin_student
        FOREIGN KEY (banner_id) REFERENCES students(banner_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE inspections (
    inspection_id INT AUTO_INCREMENT PRIMARY KEY,
    apartment_id INT NOT NULL,
    staff_id INT NOT NULL,
    inspection_date DATE NOT NULL,
    is_satisfactory BOOLEAN NOT NULL,
    comments TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inspections_apartment
        FOREIGN KEY (apartment_id) REFERENCES apartments(apartment_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_inspections_staff
        FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_inspections_apartment_id ON inspections(apartment_id);
CREATE INDEX idx_inspections_staff_id ON inspections(staff_id);
CREATE INDEX idx_inspections_sat ON inspections(is_satisfactory);

DROP VIEW IF EXISTS v_senior_staff;
DROP VIEW IF EXISTS v_hall_place_counts;
DROP VIEW IF EXISTS v_hall_rent_stats;
DROP VIEW IF EXISTS v_student_advisers;
DROP VIEW IF EXISTS v_students_without_kin;
DROP VIEW IF EXISTS v_student_category_counts;
DROP VIEW IF EXISTS v_waiting_list;
DROP VIEW IF EXISTS v_hall_student_rooms;
DROP VIEW IF EXISTS v_unsatisfactory_inspections;
DROP VIEW IF EXISTS v_unpaid_invoices;
DROP VIEW IF EXISTS v_student_rent_paid;
DROP VIEW IF EXISTS v_summer_leases;
DROP VIEW IF EXISTS v_student_leases;
DROP VIEW IF EXISTS v_hall_managers;

CREATE VIEW v_hall_managers AS
SELECT
    h.hall_id,
    h.hall_name,
    CONCAT(s.first_name, ' ', s.last_name) AS manager_name,
    COALESCE(s.internal_phone, '') AS manager_phone
FROM halls h
JOIN staff s ON s.staff_id = h.manager_staff_id;

CREATE VIEW v_student_leases AS
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
LEFT JOIN apartments a ON a.apartment_id = r.apartment_id;

CREATE VIEW v_summer_leases AS
SELECT
    lease_id,
    banner_id,
    student_name,
    duration_semesters,
    includes_summer_semester,
    date_enter,
    date_leave,
    place_number,
    room_number,
    monthly_rent,
    residence_type,
    residence_name,
    residence_address
FROM v_student_leases
WHERE includes_summer_semester = TRUE;

CREATE VIEW v_student_rent_paid AS
SELECT
    s.banner_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    COALESCE(SUM(CASE WHEN i.date_paid IS NOT NULL THEN i.amount_due ELSE 0 END), 0) AS total_paid
FROM students s
LEFT JOIN leases l ON l.banner_id = s.banner_id
LEFT JOIN invoices i ON i.lease_id = l.lease_id
GROUP BY s.banner_id, s.first_name, s.last_name;

CREATE VIEW v_unpaid_invoices AS
SELECT
    i.invoice_id,
    i.lease_id,
    s.banner_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    i.semester,
    i.amount_due,
    i.due_date,
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
WHERE i.date_paid IS NULL;

CREATE VIEW v_unsatisfactory_inspections AS
SELECT
    i.inspection_id,
    i.inspection_date,
    CONCAT(s.first_name, ' ', s.last_name) AS staff_name,
    i.apartment_id,
    COALESCE(i.comments, '') AS comments
FROM inspections i
JOIN staff s ON s.staff_id = i.staff_id
WHERE i.is_satisfactory = FALSE;

CREATE VIEW v_hall_student_rooms AS
SELECT
    h.hall_id,
    s.banner_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    h.hall_name,
    r.room_number,
    r.place_number
FROM leases l
JOIN students s ON s.banner_id = l.banner_id
JOIN rooms r ON r.place_number = l.place_number
JOIN halls h ON h.hall_id = r.hall_id;

CREATE VIEW v_waiting_list AS
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
WHERE status = 'Waiting';

CREATE VIEW v_student_category_counts AS
SELECT
    category,
    COUNT(*) AS student_count
FROM students
GROUP BY category;

CREATE VIEW v_students_without_kin AS
SELECT
    s.banner_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name
FROM students s
LEFT JOIN next_of_kin n ON n.banner_id = s.banner_id
WHERE n.kin_id IS NULL;

CREATE VIEW v_student_advisers AS
SELECT
    s.banner_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    CASE WHEN a.staff_id IS NULL THEN '' ELSE CONCAT(a.first_name, ' ', a.last_name) END AS adviser_name,
    COALESCE(a.internal_phone, '') AS adviser_phone
FROM students s
LEFT JOIN staff a ON a.staff_id = s.advisor_staff_id;

CREATE VIEW v_hall_rent_stats AS
SELECT
    MIN(monthly_rent) AS min_rent,
    MAX(monthly_rent) AS max_rent,
    AVG(monthly_rent) AS avg_rent
FROM rooms
WHERE hall_id IS NOT NULL;

CREATE VIEW v_hall_place_counts AS
SELECT
    h.hall_id,
    h.hall_name,
    COUNT(r.place_number) AS total_places
FROM halls h
LEFT JOIN rooms r ON r.hall_id = h.hall_id
GROUP BY h.hall_id, h.hall_name;

CREATE VIEW v_senior_staff AS
SELECT
    s.staff_id,
    CONCAT(s.first_name, ' ', s.last_name) AS staff_name,
    TIMESTAMPDIFF(YEAR, s.dob, CURDATE()) AS age,
    s.location
FROM staff s
WHERE s.dob IS NOT NULL
  AND TIMESTAMPDIFF(YEAR, s.dob, CURDATE()) > 60;
