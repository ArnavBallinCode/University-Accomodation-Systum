-- Sample data for University Accommodation Office

-- 1. Staff Members
INSERT INTO staff (first_name, last_name, email, position, location) VALUES
('John', 'Doe', 'j.doe@univ.edu', 'Admin Strategist', 'Admin Block'),
('Jane', 'Smith', 'j.smith@univ.edu', 'Residence Manager', 'Halls Office'),
('Robert', 'Brown', 'r.brown@univ.edu', 'Reporting Analyst', 'Finance Dept');

-- 2. Courses
INSERT INTO courses (course_number, course_title, instructor_name, department_name) VALUES
('CS101', 'Intro to Computer Science', 'Dr. Alan Turing', 'Computer Science'),
('DB202', 'Database Management Systems', 'Dr. Edgar Codd', 'Data Science');

-- 3. Students
INSERT INTO students (banner_id, first_name, last_name, street, city, postcode, dob, gender, category, nationality, status, major, course_number) VALUES
('B00123456', 'Alice', 'Wonderland', '123 Rabbit Hole', 'London', 'SW1 1AA', '2003-05-15', 'Female', 'Undergraduate', 'British', 'Placed', 'Computer Science', 'CS101'),
('B00789012', 'Charlie', 'Chocolate', '456 Factory Rd', 'Birmingham', 'B1 2BB', '2002-11-22', 'Male', 'Postgraduate', 'British', 'Placed', 'Data Science', 'DB202'),
('B00554433', 'Bob', 'Builder', '789 Construction Ave', 'Manchester', 'M1 3CC', '2004-01-10', 'Male', 'Undergraduate', 'British', 'Waiting', 'Engineering', NULL);

-- 4. Halls of Residence
INSERT INTO halls (hall_name, street, city, postcode, telephone, manager_staff_id) VALUES
('Newton Hall', '100 University Rd', 'London', 'SW1 2BB', '0207-123-4567', 2),
('Einstein Hall', '102 University Rd', 'London', 'SW1 2BC', '0207-123-4568', 2);

-- 5. Apartments
INSERT INTO apartments (street, city, postcode, number_of_bedrooms) VALUES
('50 Park Lane', 'London', 'W1 4AA', 3),
('52 Park Lane', 'London', 'W1 4AB', 4);

-- 6. Rooms
-- Hall Rooms (Place numbers 1-20)
INSERT INTO rooms (place_number, room_number, monthly_rent, hall_id) VALUES
(1, 'N-101', 550.00, 1),
(2, 'N-102', 550.00, 1),
(3, 'E-201', 600.00, 2);

-- Apartment Rooms (Place numbers 101-110)
INSERT INTO rooms (place_number, room_number, monthly_rent, apartment_id) VALUES
(101, 'A1-R1', 750.00, 1),
(102, 'A1-R2', 750.00, 1);

-- 7. Leases
INSERT INTO leases (banner_id, place_number, duration_semesters, date_enter) VALUES
('B00123456', 1, 'Full Academic Year', '2025-09-01'),
('B00789012', 101, 'Autumn Semester', '2025-09-01');
