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
