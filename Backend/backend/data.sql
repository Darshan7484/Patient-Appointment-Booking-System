-- ========================================
-- Hospital Appointment System - Test Data
-- ========================================
-- Note: Passwords are hashed with BCrypt
-- Original passwords are shown in comments

-- Clear existing data (optional, uncomment if needed)
-- DELETE FROM appointments;
-- DELETE FROM users;
-- DELETE FROM doctors;

-- ========================================
-- TEST USERS
-- ========================================

-- ADMIN Account
-- Email: admin@hospital.com | Password: Admin@123
INSERT INTO users (name, email, password, role, created_at, updated_at) 
VALUES ('Admin User', 'admin@hospital.com', 
'$2a$10$YQv6c/20UsZuYvPiHhcKeuK1DkSvsTmLyWYF41aDCVsXhi..H.WFm', 
'ADMIN', NOW(), NOW())
ON DUPLICATE KEY UPDATE password=password;

-- PATIENT Account
-- Email: patient@hospital.com | Password: Patient@123
INSERT INTO users (name, email, password, phone, role, created_at, updated_at) 
VALUES ('John Doe', 'patient@hospital.com', 
'$2a$10$MQNV/.qqpvfhIyBJYQaQ.uF.wO3f7DxH7vZMxI6xTKuVjIGV.bJ/K', 
'+1-555-0101', 'PATIENT', NOW(), NOW())
ON DUPLICATE KEY UPDATE password=password;

-- DOCTOR Account (User)
-- Email: doctor@hospital.com | Password: Doctor@123
INSERT INTO users (name, email, password, phone, role, created_at, updated_at) 
VALUES ('Dr. Sarah Smith', 'doctor@hospital.com', 
'$2a$10$JrCxSxHv/T.9ggvJSdTvzeGIJBX.vvxBJcW2b2J5VGKvKCvWIGJEi', 
'+1-555-0102', 'DOCTOR', NOW(), NOW())
ON DUPLICATE KEY UPDATE password=password;

-- ========================================
-- TEST DOCTORS
-- ========================================

-- Doctor 1: Cardiology
INSERT INTO doctors (name, specialization, department, contact_number, available_time, email, phone, experience)
VALUES ('Dr. Sarah Smith', 'Cardiology', 'Heart Care', '+1-800-123-4567', 
'Monday to Friday, 9AM-5PM', 'doctor@hospital.com', '+1-555-0102', 12)
ON DUPLICATE KEY UPDATE updated_at=NOW();

-- Doctor 2: Neurology
INSERT INTO doctors (name, specialization, department, contact_number, available_time, email, phone, experience)
VALUES ('Dr. Michael Johnson', 'Neurology', 'Brain & Nerve', '+1-800-123-4568', 
'Monday to Saturday, 10AM-6PM', 'michael.johnson@hospital.com', '+1-555-0103', 8)
ON DUPLICATE KEY UPDATE updated_at=NOW();

-- Doctor 3: Orthopedics
INSERT INTO doctors (name, specialization, department, contact_number, available_time, email, phone, experience)
VALUES ('Dr. Emily Davis', 'Orthopedics', 'Bone & Joint', '+1-800-123-4569', 
'Tuesday to Friday, 11AM-4PM', 'emily.davis@hospital.com', '+1-555-0104', 10)
ON DUPLICATE KEY UPDATE updated_at=NOW();

-- ========================================
-- TEST APPOINTMENTS (Optional)
-- ========================================

-- Appointment 1: Patient booking with Dr. Sarah (if needed)
-- INSERT INTO appointments (patient_id, doctor_id, patient_name, doctor_name, patient_email, date, status, queue_position)
-- SELECT u.id, d.id, u.name, d.name, u.email, DATE_ADD(NOW(), INTERVAL 7 DAY), 'PENDING', 1
-- FROM users u, doctors d 
-- WHERE u.email = 'patient@hospital.com' AND d.name = 'Dr. Sarah Smith'
-- ON DUPLICATE KEY UPDATE updated_at=NOW();

-- ========================================
-- TEST DATA SUMMARY
-- ========================================
-- ADMIN Login: admin@hospital.com / Admin@123
-- PATIENT Login: patient@hospital.com / Patient@123
-- DOCTOR Login: doctor@hospital.com / Doctor@123
-- 
-- 3 Doctors available for appointment booking
-- Ready for full system testing
