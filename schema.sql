CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(100) NOT NULL,
    address TEXT,
    dob DATE,
    gender VARCHAR(20)
);

CREATE TABLE students (
    banner_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(30),
    email VARCHAR(255),
    dob DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    special_needs TEXT,
    comments TEXT,
    status ENUM('Placed', 'Waiting') NOT NULL,
    major VARCHAR(100) NOT NULL,
    minor VARCHAR(100),
    advisor_staff_id INT,
    CONSTRAINT fk_students_advisor
        FOREIGN KEY (advisor_staff_id) REFERENCES staff(staff_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

CREATE INDEX idx_students_advisor_staff_id ON students(advisor_staff_id);

CREATE TABLE halls (
    hall_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    telephone VARCHAR(30) NOT NULL,
    manager_id INT NOT NULL,
    CONSTRAINT fk_halls_manager
        FOREIGN KEY (manager_id) REFERENCES staff(staff_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

CREATE INDEX idx_halls_manager_id ON halls(manager_id);

CREATE TABLE apartments (
    apartment_id INT AUTO_INCREMENT PRIMARY KEY,
    address TEXT NOT NULL,
    number_of_beds INT NOT NULL,
    CONSTRAINT chk_apartments_number_of_beds CHECK (number_of_beds > 0)
);

CREATE TABLE rooms (
    place_number INT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    hall_id INT,
    apartment_id INT,
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
    duration VARCHAR(50) NOT NULL,
    date_enter DATE NOT NULL,
    date_leave DATE,
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

CREATE TABLE invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    semester VARCHAR(30) NOT NULL,
    amount_due DECIMAL(10, 2) NOT NULL,
    date_paid DATE,
    payment_method VARCHAR(50),
    first_reminder_date DATE,
    second_reminder_date DATE,
    CONSTRAINT chk_invoices_amount_due CHECK (amount_due >= 0),
    CONSTRAINT fk_invoices_lease
        FOREIGN KEY (lease_id) REFERENCES leases(lease_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_invoices_lease_id ON invoices(lease_id);
CREATE INDEX idx_invoices_date_paid ON invoices(date_paid);

CREATE TABLE next_of_kin (
    kin_id INT AUTO_INCREMENT PRIMARY KEY,
    banner_id VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    relationship VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    CONSTRAINT fk_next_of_kin_student
        FOREIGN KEY (banner_id) REFERENCES students(banner_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE INDEX idx_next_of_kin_banner_id ON next_of_kin(banner_id);

CREATE TABLE inspections (
    inspection_id INT AUTO_INCREMENT PRIMARY KEY,
    apartment_id INT NOT NULL,
    staff_id INT NOT NULL,
    inspection_date DATE NOT NULL,
    condition_status ENUM('Yes', 'No') NOT NULL,
    comments TEXT,
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
