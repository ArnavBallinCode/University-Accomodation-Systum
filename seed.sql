-- High-volume seed data for University Accommodation Office
-- Designed so report endpoints have rich, varied outputs.

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE inspections;
TRUNCATE TABLE next_of_kin;
TRUNCATE TABLE invoices;
TRUNCATE TABLE leases;
TRUNCATE TABLE rooms;
TRUNCATE TABLE apartments;
TRUNCATE TABLE halls;
TRUNCATE TABLE students;
TRUNCATE TABLE courses;
TRUNCATE TABLE staff;
SET FOREIGN_KEY_CHECKS = 1;

-- 1) Staff
-- First 12 are senior so report (n) returns 10+ rows.
INSERT INTO staff (
	first_name,
	last_name,
	email,
	street,
	city,
	postcode,
	dob,
	gender,
	position,
	department_name,
	internal_phone,
	room_number,
	location
) VALUES
('Aarav', 'Mehta', 'aarav.mehta@uni-accom.edu', '1 Admin Way', 'London', 'SW1A 1AA', '1959-02-15', 'Male', 'Admin Strategist', 'Administration', 'EXT-1001', 'A-101', 'Admin Block'),
('Bella', 'Carter', 'bella.carter@uni-accom.edu', '2 Admin Way', 'London', 'SW1A 1AB', '1960-07-09', 'Female', 'Residence Manager', 'Residences', 'EXT-2001', 'H-201', 'Halls Office'),
('Caleb', 'Singh', 'caleb.singh@uni-accom.edu', '3 Admin Way', 'London', 'SW1A 1AC', '1961-11-28', 'Male', 'Residence Manager', 'Residences', 'EXT-2002', 'H-202', 'Halls Office'),
('Diana', 'Lopez', 'diana.lopez@uni-accom.edu', '4 Admin Way', 'London', 'SW1A 1AD', '1958-04-02', 'Female', 'Residence Manager', 'Residences', 'EXT-2003', 'H-203', 'Halls Office'),
('Ethan', 'Brooks', 'ethan.brooks@uni-accom.edu', '5 Admin Way', 'London', 'SW1A 1AE', '1962-06-17', 'Male', 'Residence Manager', 'Residences', 'EXT-2004', 'H-204', 'Halls Office'),
('Farah', 'Khan', 'farah.khan@uni-accom.edu', '6 Admin Way', 'London', 'SW1A 1AF', '1957-09-23', 'Female', 'Residence Manager', 'Residences', 'EXT-2005', 'H-205', 'Halls Office'),
('Gideon', 'Park', 'gideon.park@uni-accom.edu', '7 Admin Way', 'London', 'SW1A 1AG', '1964-12-01', 'Male', 'Residence Manager', 'Residences', 'EXT-2006', 'H-206', 'Halls Office'),
('Hana', 'Imai', 'hana.imai@uni-accom.edu', '8 Admin Way', 'London', 'SW1A 1AH', '1956-01-14', 'Female', 'Residence Manager', 'Residences', 'EXT-2007', 'H-207', 'Halls Office'),
('Ishaan', 'Verma', 'ishaan.verma@uni-accom.edu', '9 Admin Way', 'London', 'SW1A 1AJ', '1963-03-29', 'Male', 'Residence Manager', 'Residences', 'EXT-2008', 'H-208', 'Halls Office'),
('Julia', 'Novak', 'julia.novak@uni-accom.edu', '10 Admin Way', 'London', 'SW1A 1AK', '1955-10-05', 'Female', 'Residence Manager', 'Residences', 'EXT-2009', 'H-209', 'Halls Office'),
('Karan', 'Patel', 'karan.patel@uni-accom.edu', '11 Admin Way', 'London', 'SW1A 1AL', '1961-08-08', 'Male', 'Residence Manager', 'Residences', 'EXT-2010', 'H-210', 'Halls Office'),
('Lila', 'Rossi', 'lila.rossi@uni-accom.edu', '12 Admin Way', 'London', 'SW1A 1AM', '1959-05-30', 'Female', 'Residence Manager', 'Residences', 'EXT-2011', 'H-211', 'Halls Office'),
('Mason', 'Gray', 'mason.gray@uni-accom.edu', '13 Admin Way', 'London', 'SW1A 1AN', '1988-07-04', 'Male', 'Student Adviser', 'Student Affairs', 'EXT-3101', 'S-301', 'Student Centre'),
('Nora', 'Blake', 'nora.blake@uni-accom.edu', '14 Admin Way', 'London', 'SW1A 1AP', '1986-02-11', 'Female', 'Student Adviser', 'Student Affairs', 'EXT-3102', 'S-302', 'Student Centre'),
('Omar', 'Reed', 'omar.reed@uni-accom.edu', '15 Admin Way', 'London', 'SW1A 1AQ', '1990-09-22', 'Male', 'Inspection Lead', 'Compliance', 'EXT-4101', 'C-401', 'Compliance Office'),
('Priya', 'Nair', 'priya.nair@uni-accom.edu', '16 Admin Way', 'London', 'SW1A 1AR', '1989-12-03', 'Female', 'Inspection Officer', 'Compliance', 'EXT-4102', 'C-402', 'Compliance Office'),
('Quentin', 'Hale', 'quentin.hale@uni-accom.edu', '17 Admin Way', 'London', 'SW1A 1AS', '1991-01-19', 'Male', 'Finance Officer', 'Finance', 'EXT-5101', 'F-501', 'Finance Dept'),
('Riya', 'Sharma', 'riya.sharma@uni-accom.edu', '18 Admin Way', 'London', 'SW1A 1AT', '1987-05-26', 'Female', 'Reporting Analyst', 'Data & Reporting', 'EXT-6101', 'D-601', 'Data Office');

-- 2) Courses
INSERT INTO courses (
	course_number,
	course_title,
	instructor_name,
	instructor_phone,
	instructor_email,
	instructor_room,
	department_name
) VALUES
('CS101', 'Introduction to Computer Science', 'Dr. Alan Turing', '0207-900-1001', 'turing@uni-accom.edu', 'CS-101', 'Computer Science'),
('DB202', 'Database Management Systems', 'Dr. Edgar Codd', '0207-900-1002', 'codd@uni-accom.edu', 'CS-202', 'Computer Science'),
('AI305', 'Applied Artificial Intelligence', 'Dr. Fei Li', '0207-900-1003', 'fli@uni-accom.edu', 'CS-305', 'Computer Science'),
('MG210', 'Management Principles', 'Dr. Mary Parker', '0207-900-2001', 'parker@uni-accom.edu', 'MG-210', 'Management'),
('AR110', 'Architectural Studio I', 'Dr. Zaha Noor', '0207-900-3001', 'znoor@uni-accom.edu', 'AR-110', 'Architecture'),
('CS401', 'Robotics and Systems', 'Dr. Rodney Brooks', '0207-900-1004', 'brooks@uni-accom.edu', 'CS-401', 'Computer Science'),
('MA120', 'Mathematics for Computing', 'Dr. Emmy Noether', '0207-900-4001', 'noether@uni-accom.edu', 'MA-120', 'Mathematics'),
('PH130', 'Foundations of Physics', 'Dr. Marie Curie', '0207-900-5001', 'curie@uni-accom.edu', 'PH-130', 'Physics'),
('EC200', 'Microeconomics', 'Dr. Amartya Sen', '0207-900-6001', 'asen@uni-accom.edu', 'EC-200', 'Economics'),
('CH115', 'Introductory Chemistry', 'Dr. Rosalind Franklin', '0207-900-7001', 'franklin@uni-accom.edu', 'CH-115', 'Chemistry');

-- 3) Students
-- 30 students with 10 categories and mixed adviser assignment.
INSERT INTO students (
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
) VALUES
('B00123456', 'Alice', 'Wonderland', '101 Cedar St', 'London', 'SW1 1AA', '07111111111', 'alice.wonderland@students.uni-accom.edu', '2003-05-15', 'Female', 'Undergraduate', 'British', NULL, 'Prefers quiet floor', 'Placed', 'Computer Science', 'Mathematics', 'CS101', 13),
('B00123457', 'Brian', 'Stone', '102 Cedar St', 'London', 'SW1 1AB', '07111111112', 'brian.stone@students.uni-accom.edu', '2002-07-22', 'Male', 'Postgraduate', 'Irish', NULL, NULL, 'Placed', 'Data Science', 'Economics', 'DB202', 14),
('B00123458', 'Chloe', 'Rivers', '103 Cedar St', 'London', 'SW1 1AC', '07111111113', 'chloe.rivers@students.uni-accom.edu', '2001-11-02', 'Female', 'International', 'Indian', 'Wheelchair access needed', NULL, 'Placed', 'Artificial Intelligence', NULL, 'AI305', 13),
('B00123459', 'Daniel', 'Frost', '104 Cedar St', 'London', 'SW1 1AD', '07111111114', 'daniel.frost@students.uni-accom.edu', '2003-02-10', 'Male', 'Exchange', 'Canadian', NULL, 'One semester exchange', 'Placed', 'Management', NULL, 'MG210', 15),
('B00123460', 'Eva', 'Bloom', '105 Cedar St', 'London', 'SW1 1AE', '07111111115', 'eva.bloom@students.uni-accom.edu', '2004-01-19', 'Female', 'Erasmus', 'Spanish', NULL, NULL, 'Placed', 'Architecture', 'Design', 'AR110', 16),
('B00123461', 'Farhan', 'Ali', '106 Cedar St', 'London', 'SW1 1AF', '07111111116', 'farhan.ali@students.uni-accom.edu', '2000-09-07', 'Male', 'PhD', 'Pakistani', NULL, 'Lab access priority', 'Placed', 'Robotics', NULL, 'CS401', 13),
('B00123462', 'Gia', 'North', '107 Cedar St', 'London', 'SW1 1AG', '07111111117', 'gia.north@students.uni-accom.edu', '2002-12-30', 'Female', 'PartTime', 'British', NULL, NULL, 'Placed', 'Mathematics', 'Computer Science', 'MA120', 14),
('B00123463', 'Harsh', 'Vaid', '108 Cedar St', 'London', 'SW1 1AH', '07111111118', 'harsh.vaid@students.uni-accom.edu', '2004-04-06', 'Male', 'Foundation', 'Indian', NULL, 'Foundation to UG pathway', 'Placed', 'Physics', NULL, 'PH130', 15),
('B00123464', 'Ivy', 'Quinn', '109 Cedar St', 'London', 'SW1 1AJ', '07111111119', 'ivy.quinn@students.uni-accom.edu', '2003-08-18', 'Female', 'Returning', 'British', NULL, NULL, 'Placed', 'Economics', 'Data Science', 'EC200', 16),
('B00123465', 'Jacob', 'Flint', '110 Cedar St', 'London', 'SW1 1AK', '07111111120', 'jacob.flint@students.uni-accom.edu', '2001-03-11', 'Male', 'Sponsored', 'Kenyan', NULL, 'Sponsored by STEM trust', 'Placed', 'Chemistry', NULL, 'CH115', 17),
('B00123466', 'Kira', 'Moons', '111 Cedar St', 'London', 'SW1 1AL', '07111111121', 'kira.moons@students.uni-accom.edu', '2002-06-24', 'Female', 'Undergraduate', 'German', NULL, NULL, 'Placed', 'Computer Science', 'Physics', 'CS101', 13),
('B00123467', 'Leon', 'Bright', '112 Cedar St', 'London', 'SW1 1AM', '07111111122', 'leon.bright@students.uni-accom.edu', '2001-10-14', 'Male', 'Postgraduate', 'French', NULL, NULL, 'Placed', 'Data Science', NULL, 'DB202', 14),
('B00123468', 'Mira', 'Cole', '113 Cedar St', 'London', 'SW1 1AN', '07111111123', 'mira.cole@students.uni-accom.edu', '2000-01-09', 'Female', 'International', 'Nigerian', NULL, NULL, 'Placed', 'Artificial Intelligence', 'Mathematics', 'AI305', 13),
('B00123469', 'Nikhil', 'Rao', '114 Cedar St', 'London', 'SW1 1AP', '07111111124', 'nikhil.rao@students.uni-accom.edu', '2003-11-26', 'Male', 'Exchange', 'Indian', NULL, NULL, 'Placed', 'Management', NULL, 'MG210', 15),
('B00123470', 'Opal', 'Hart', '115 Cedar St', 'London', 'SW1 1AQ', '07111111125', 'opal.hart@students.uni-accom.edu', '2004-02-02', 'Female', 'Erasmus', 'Italian', NULL, NULL, 'Placed', 'Architecture', NULL, 'AR110', 16),
('B00123471', 'Parth', 'Jain', '116 Cedar St', 'London', 'SW1 1AR', '07111111126', 'parth.jain@students.uni-accom.edu', '1999-12-21', 'Male', 'PhD', 'Indian', NULL, NULL, 'Placed', 'Robotics', NULL, 'CS401', 13),
('B00123472', 'Quinn', 'Vale', '117 Cedar St', 'London', 'SW1 1AS', '07111111127', 'quinn.vale@students.uni-accom.edu', '2002-05-03', 'Female', 'PartTime', 'British', NULL, NULL, 'Placed', 'Mathematics', NULL, 'MA120', 14),
('B00123473', 'Rhea', 'Dawn', '118 Cedar St', 'London', 'SW1 1AT', '07111111128', 'rhea.dawn@students.uni-accom.edu', '2003-09-27', 'Female', 'Foundation', 'British', NULL, NULL, 'Placed', 'Physics', NULL, 'PH130', 15),
('B00123474', 'Samir', 'Khan', '119 Cedar St', 'London', 'SW1 1AU', '07111111129', 'samir.khan@students.uni-accom.edu', '2002-03-08', 'Male', 'Returning', 'Pakistani', NULL, 'Awaiting placement preference', 'Waiting', 'Economics', NULL, 'EC200', NULL),
('B00123475', 'Tara', 'Blue', '120 Cedar St', 'London', 'SW1 1AV', '07111111130', 'tara.blue@students.uni-accom.edu', '2001-06-16', 'Female', 'Sponsored', 'Ghanaian', NULL, NULL, 'Waiting', 'Chemistry', NULL, 'CH115', NULL),
('B00123476', 'Uma', 'Gold', '121 Cedar St', 'London', 'SW1 1AW', '07111111131', 'uma.gold@students.uni-accom.edu', '2004-04-12', 'Female', 'Undergraduate', 'British', NULL, NULL, 'Waiting', 'Computer Science', NULL, 'CS101', 17),
('B00123477', 'Vik', 'Noor', '122 Cedar St', 'London', 'SW1 1AX', '07111111132', 'vik.noor@students.uni-accom.edu', '2003-07-03', 'Male', 'Postgraduate', 'Bangladeshi', NULL, NULL, 'Waiting', 'Data Science', NULL, 'DB202', NULL),
('B00123478', 'Wren', 'Ivy', '123 Cedar St', 'London', 'SW1 1AY', '07111111133', 'wren.ivy@students.uni-accom.edu', '2002-12-05', 'Female', 'International', 'Brazilian', NULL, NULL, 'Waiting', 'Artificial Intelligence', NULL, 'AI305', 18),
('B00123479', 'Xena', 'Lake', '124 Cedar St', 'London', 'SW1 1AZ', '07111111134', 'xena.lake@students.uni-accom.edu', '2003-01-28', 'Female', 'Exchange', 'American', NULL, NULL, 'Waiting', 'Management', NULL, 'MG210', NULL),
('B00123480', 'Yash', 'Roy', '125 Cedar St', 'London', 'SW1 1BA', '07111111135', 'yash.roy@students.uni-accom.edu', '2004-10-09', 'Male', 'Erasmus', 'Indian', NULL, NULL, 'Waiting', 'Architecture', NULL, 'AR110', NULL),
('B00123481', 'Zara', 'Moss', '126 Cedar St', 'London', 'SW1 1BB', '07111111136', 'zara.moss@students.uni-accom.edu', '2000-08-17', 'Female', 'PhD', 'South African', NULL, NULL, 'Waiting', 'Robotics', NULL, 'CS401', 18),
('B00123482', 'Ayaan', 'Reed', '127 Cedar St', 'London', 'SW1 1BC', '07111111137', 'ayaan.reed@students.uni-accom.edu', '2002-02-01', 'Male', 'PartTime', 'British', NULL, NULL, 'Waiting', 'Mathematics', NULL, 'MA120', NULL),
('B00123483', 'Bella', 'Snow', '128 Cedar St', 'London', 'SW1 1BD', '07111111138', 'bella.snow@students.uni-accom.edu', '2004-06-13', 'Female', 'Foundation', 'British', NULL, NULL, 'Waiting', 'Physics', NULL, 'PH130', NULL),
('B00123484', 'Cian', 'Grey', '129 Cedar St', 'London', 'SW1 1BE', '07111111139', 'cian.grey@students.uni-accom.edu', '2003-09-01', 'Male', 'Returning', 'Irish', NULL, NULL, 'Waiting', 'Economics', NULL, 'EC200', NULL),
('B00123485', 'Diya', 'Lark', '130 Cedar St', 'London', 'SW1 1BF', '07111111140', 'diya.lark@students.uni-accom.edu', '2001-05-29', 'Female', 'Sponsored', 'Indian', NULL, NULL, 'Waiting', 'Chemistry', NULL, 'CH115', 18);

-- 4) Halls (12 rows for report a and m)
INSERT INTO halls (hall_name, street, city, postcode, telephone, manager_staff_id) VALUES
('Newton Hall', '100 University Rd', 'London', 'SW1 2BB', '0207-123-4501', 2),
('Einstein Hall', '102 University Rd', 'London', 'SW1 2BC', '0207-123-4502', 3),
('Curie Hall', '104 University Rd', 'London', 'SW1 2BD', '0207-123-4503', 4),
('Turing Hall', '106 University Rd', 'London', 'SW1 2BE', '0207-123-4504', 5),
('Tesla Hall', '108 University Rd', 'London', 'SW1 2BF', '0207-123-4505', 6),
('Raman Hall', '110 University Rd', 'London', 'SW1 2BG', '0207-123-4506', 7),
('Hopper Hall', '112 University Rd', 'London', 'SW1 2BH', '0207-123-4507', 8),
('Ada Hall', '114 University Rd', 'London', 'SW1 2BJ', '0207-123-4508', 9),
('Faraday Hall', '116 University Rd', 'London', 'SW1 2BK', '0207-123-4509', 10),
('Darwin Hall', '118 University Rd', 'London', 'SW1 2BL', '0207-123-4510', 11),
('Kepler Hall', '120 University Rd', 'London', 'SW1 2BM', '0207-123-4511', 12),
('Galileo Hall', '122 University Rd', 'London', 'SW1 2BN', '0207-123-4512', 1);

-- 5) Apartments
INSERT INTO apartments (street, city, postcode, number_of_bedrooms) VALUES
('50 Park Lane', 'London', 'W1 4AA', 3),
('52 Park Lane', 'London', 'W1 4AB', 4),
('54 Park Lane', 'London', 'W1 4AC', 5),
('56 Park Lane', 'London', 'W1 4AD', 3),
('58 Park Lane', 'London', 'W1 4AE', 4),
('60 Park Lane', 'London', 'W1 4AF', 5);

-- 6) Rooms
-- Hall 1 intentionally has 14 places so report (g) with hall_id=1 returns 10+ rows.
INSERT INTO rooms (place_number, room_number, monthly_rent, hall_id) VALUES
(1, 'N-101', 520.00, 1),
(2, 'N-102', 525.00, 1),
(3, 'N-103', 530.00, 1),
(4, 'N-104', 535.00, 1),
(5, 'N-105', 540.00, 1),
(6, 'N-106', 545.00, 1),
(7, 'N-107', 550.00, 1),
(8, 'N-108', 555.00, 1),
(9, 'N-109', 560.00, 1),
(10, 'N-110', 565.00, 1),
(11, 'N-111', 570.00, 1),
(12, 'N-112', 575.00, 1),
(13, 'N-113', 580.00, 1),
(14, 'N-114', 585.00, 1),
(15, 'E-201', 590.00, 2),
(16, 'E-202', 595.00, 2),
(17, 'C-301', 600.00, 3),
(18, 'C-302', 605.00, 3),
(19, 'T-401', 610.00, 4),
(20, 'T-402', 620.00, 4),
(21, 'TS-501', 630.00, 5),
(22, 'TS-502', 640.00, 5),
(23, 'R-601', 650.00, 6),
(24, 'R-602', 660.00, 6),
(25, 'H-701', 670.00, 7),
(26, 'H-702', 680.00, 7),
(27, 'A-801', 690.00, 8),
(28, 'A-802', 700.00, 8),
(29, 'F-901', 710.00, 9),
(30, 'F-902', 720.00, 9),
(31, 'D-1001', 730.00, 10),
(32, 'D-1002', 740.00, 10),
(33, 'K-1101', 750.00, 11),
(34, 'K-1102', 760.00, 11),
(35, 'G-1201', 780.00, 12),
(36, 'G-1202', 790.00, 12);

INSERT INTO rooms (place_number, room_number, monthly_rent, apartment_id) VALUES
(101, 'A1-R1', 820.00, 1),
(102, 'A1-R2', 825.00, 1),
(103, 'A2-R1', 840.00, 2),
(104, 'A2-R2', 845.00, 2),
(105, 'A3-R1', 860.00, 3),
(106, 'A3-R2', 865.00, 3),
(107, 'A4-R1', 880.00, 4),
(108, 'A4-R2', 885.00, 4),
(109, 'A5-R1', 900.00, 5),
(110, 'A5-R2', 905.00, 5),
(111, 'A6-R1', 930.00, 6),
(112, 'A6-R2', 940.00, 6);

-- 7) Leases (18 rows for report b, 14 summer rows for report c)
INSERT INTO leases (
	banner_id,
	place_number,
	duration_semesters,
	includes_summer_semester,
	date_enter,
	date_leave
) VALUES
('B00123456', 1, 'Full Academic Year', TRUE, '2025-09-01', '2026-08-31'),
('B00123457', 2, 'Full Academic Year', TRUE, '2025-09-01', '2026-08-31'),
('B00123458', 3, 'Full Academic Year', TRUE, '2025-09-01', '2026-08-31'),
('B00123459', 4, 'Autumn + Spring', TRUE, '2025-09-01', '2026-06-30'),
('B00123460', 5, 'Autumn + Spring', TRUE, '2025-09-01', '2026-06-30'),
('B00123461', 6, 'Full Academic Year', TRUE, '2025-09-01', '2026-08-31'),
('B00123462', 7, 'Autumn + Spring', TRUE, '2025-09-01', '2026-06-30'),
('B00123463', 8, 'Autumn + Spring', TRUE, '2025-09-01', '2026-06-30'),
('B00123464', 9, 'Full Academic Year', TRUE, '2025-09-01', '2026-08-31'),
('B00123465', 10, 'Full Academic Year', TRUE, '2025-09-01', '2026-08-31'),
('B00123466', 11, 'Autumn + Spring', TRUE, '2025-09-01', '2026-06-30'),
('B00123467', 12, 'Autumn + Spring', TRUE, '2025-09-01', '2026-06-30'),
('B00123468', 15, 'Autumn + Spring', FALSE, '2025-09-01', '2026-06-30'),
('B00123469', 17, 'Autumn + Spring', FALSE, '2025-09-01', '2026-06-30'),
('B00123470', 101, 'Full Academic Year', FALSE, '2025-09-01', '2026-08-31'),
('B00123471', 102, 'Full Academic Year', FALSE, '2025-09-01', '2026-08-31'),
('B00123472', 19, 'Full Academic Year', TRUE, '2025-09-01', '2026-08-31'),
('B00123473', 21, 'Full Academic Year', TRUE, '2025-09-01', '2026-08-31');

-- 8) Invoices
-- Paid invoices so rent-paid report has meaningful values.
INSERT INTO invoices (
	lease_id,
	semester,
	amount_due,
	due_date,
	date_paid,
	payment_method
)
SELECT
	l.lease_id,
	'2025-FALL',
	ROUND(r.monthly_rent * 4, 2),
	'2025-10-15',
	'2025-10-10',
	CASE
		WHEN MOD(l.lease_id, 3) = 0 THEN 'Bank Transfer'
		WHEN MOD(l.lease_id, 3) = 1 THEN 'Card'
		ELSE 'Cash'
	END
FROM leases l
JOIN rooms r ON r.place_number = l.place_number;

-- Unpaid spring invoices (18 rows for report e).
INSERT INTO invoices (
	lease_id,
	semester,
	amount_due,
	due_date,
	first_reminder_date
)
SELECT
	l.lease_id,
	'2026-SPRING',
	ROUND(r.monthly_rent * 4, 2),
	'2026-03-15',
	'2026-03-25'
FROM leases l
JOIN rooms r ON r.place_number = l.place_number;

-- Additional unpaid summer invoices for leases that include summer (14 more rows).
INSERT INTO invoices (
	lease_id,
	semester,
	amount_due,
	due_date,
	first_reminder_date,
	second_reminder_date
)
SELECT
	l.lease_id,
	'2026-SUMMER',
	ROUND(r.monthly_rent * 2, 2),
	'2026-07-15',
	'2026-07-25',
	'2026-08-05'
FROM leases l
JOIN rooms r ON r.place_number = l.place_number
WHERE l.includes_summer_semester = TRUE;

-- 9) Next of kin
-- Deliberately not inserted for every student so report (j) has 10+ rows.
INSERT INTO next_of_kin (banner_id, name, relationship, street, city, postcode, phone) VALUES
('B00123456', 'Nora Wonderland', 'Mother', '2 Cedar St', 'London', 'SW1 1ZZ', '07000000001'),
('B00123457', 'Peter Stone', 'Father', '3 Cedar St', 'London', 'SW1 1ZY', '07000000002'),
('B00123458', 'Rekha Rivers', 'Mother', '4 Cedar St', 'London', 'SW1 1ZX', '07000000003'),
('B00123459', 'Miles Frost', 'Brother', '5 Cedar St', 'London', 'SW1 1ZW', '07000000004'),
('B00123460', 'Lina Bloom', 'Sister', '6 Cedar St', 'London', 'SW1 1ZV', '07000000005'),
('B00123461', 'Imran Ali', 'Father', '7 Cedar St', 'London', 'SW1 1ZU', '07000000006'),
('B00123462', 'Ava North', 'Mother', '8 Cedar St', 'London', 'SW1 1ZT', '07000000007'),
('B00123463', 'Raj Vaid', 'Father', '9 Cedar St', 'London', 'SW1 1ZS', '07000000008'),
('B00123464', 'Elise Quinn', 'Mother', '10 Cedar St', 'London', 'SW1 1ZR', '07000000009'),
('B00123465', 'Troy Flint', 'Father', '11 Cedar St', 'London', 'SW1 1ZQ', '07000000010'),
('B00123466', 'Mina Moons', 'Guardian', '12 Cedar St', 'London', 'SW1 1ZP', '07000000011'),
('B00123467', 'Ravi Bright', 'Uncle', '13 Cedar St', 'London', 'SW1 1ZN', '07000000012');

-- 10) Inspections
-- 12 unsatisfactory rows for report (f) plus 4 satisfactory for realism.
INSERT INTO inspections (apartment_id, staff_id, inspection_date, is_satisfactory, comments) VALUES
(1, 15, '2025-10-02', FALSE, 'Damp wall near kitchenette.'),
(1, 16, '2025-11-14', FALSE, 'Smoke alarm battery missing.'),
(2, 15, '2025-10-20', FALSE, 'Broken wardrobe hinge in bedroom 2.'),
(2, 18, '2025-12-05', FALSE, 'Bathroom ventilation inadequate.'),
(3, 16, '2025-10-28', FALSE, 'Loose electrical socket in living room.'),
(3, 15, '2026-01-09', FALSE, 'Water leak under sink.'),
(4, 18, '2025-11-30', FALSE, 'Window latch damaged.'),
(4, 16, '2026-02-11', FALSE, 'Mold growth near ceiling corner.'),
(5, 15, '2025-12-18', FALSE, 'Fire extinguisher overdue service.'),
(5, 18, '2026-03-03', FALSE, 'Kitchen hob ignition inconsistent.'),
(6, 16, '2026-03-19', FALSE, 'Entry lock stiff and unsafe.'),
(6, 15, '2026-04-07', FALSE, 'Fridge seal damaged, hygiene risk.'),
(1, 15, '2026-04-22', TRUE, 'Follow-up inspection passed after maintenance.'),
(2, 16, '2026-04-24', TRUE, 'All prior issues resolved.'),
(3, 18, '2026-04-25', TRUE, 'Apartment condition satisfactory.'),
(4, 15, '2026-04-26', TRUE, 'No concerns observed.');
