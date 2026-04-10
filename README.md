# 🏥 Patient Appointment Booking System

> A full-stack web application for booking and managing patient appointments — with role-based access for Patients, Doctors, and Admins, JWT authentication, scheduling management, and a secure Spring Boot REST API integrated with a ReactJS frontend.

![Java](https://img.shields.io/badge/Java-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-1D9E75?style=flat)

---

## 📌 Overview

Patient Appointment Booking System is a full-stack healthcare web application that allows patients to book appointments with doctors, doctors to manage their schedules, and admins to oversee the entire system. Built with Java Spring Boot on the backend and ReactJS on the frontend, it follows MVC architecture with JWT-based authentication and role-based access control.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📅 Appointment Booking | Patients browse doctors and book, reschedule, or cancel appointments |
| 🔐 JWT Authentication | Secure login/register for all roles with token-based sessions |
| 👥 Role-Based Access | Patient, Doctor, Admin — each with dedicated dashboard and permissions |
| 🩺 Doctor Management | Doctors manage availability, view schedule, update appointment status |
| 📋 Appointment History | Full history of past and upcoming appointments |
| 🛡️ Admin Dashboard | Manage users, doctors, and all appointments system-wide |

---

## 👥 User Roles

### 🧑‍💼 Patient
- Register and login
- Browse available doctors
- Book / reschedule / cancel appointments
- View appointment history

### 🩺 Doctor
- View and manage scheduled appointments
- Set availability slots
- Update appointment status
- View patient details

### 🛡️ Admin
- Manage all users and doctors
- View and override all appointments
- System-wide access and analytics

---

## 🏗️ System Architecture

```
ReactJS Frontend  →  Spring Boot REST API  →  MySQL Database
 (Axios, Hooks)      (JWT, MVC, JPA)         (Users, Doctors,
                                               Appointments)
```

---

## 🛠️ Tech Stack

**Backend:** Java · Spring Boot · REST APIs · JWT Authentication · JPA/Hibernate · MVC Architecture · Maven  
**Frontend:** ReactJS · Axios · React Hooks · React Router · HTML5 · CSS3  
**Database:** MySQL · Schema Design · SQL Query Optimization  
**Tools:** Git · Postman · VS Code · IntelliJ IDEA  

---

## 🔗 REST API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT token |

### Appointments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/appointments` | Patient | Book a new appointment |
| GET | `/api/appointments/my` | Patient | Get patient's appointments |
| PUT | `/api/appointments/{id}` | Patient / Doctor | Update appointment status |
| DELETE | `/api/appointments/{id}` | Patient | Cancel appointment |

### Doctor
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/doctors` | Patient | List all available doctors |
| GET | `/api/doctor/schedule` | Doctor | Get doctor's schedule |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/users` | Admin | Get all system users |
| GET | `/api/admin/appointments` | Admin | Get all appointments |

---

## 📁 Folder Structure

```
patient-appointment-booking-system/
│
├── backend/
│   └── src/main/java/com/appointment/
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── AppointmentController.java
│       │   └── AdminController.java
│       ├── service/
│       ├── repository/
│       ├── model/
│       │   ├── User.java
│       │   ├── Doctor.java
│       │   └── Appointment.java
│       ├── security/
│       │   └── JwtFilter.java
│       └── dto/
│
└── frontend/
    └── src/
        ├── components/
        │   ├── BookingForm/
        │   ├── AppointmentList/
        │   └── DoctorCard/
        ├── pages/
        │   ├── PatientDashboard/
        │   ├── DoctorDashboard/
        │   └── AdminDashboard/
        ├── services/
        │   └── api.js
        └── App.js
```

---

## ▶️ How to Run

### 1. Clone the repository
```bash
git clone https://github.com/Darshan7484/patient-appointment-booking-system.git
cd patient-appointment-booking-system
```

### 2. Configure the database
Create a MySQL database named `appointment_db`, then update `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/appointment_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your_jwt_secret_key
```

### 3. Run the Spring Boot backend
```bash
cd backend
mvn spring-boot:run
# API runs at http://localhost:8080
```

### 4. Start the ReactJS frontend
```bash
cd frontend
npm install
npm start
# App runs at http://localhost:3000
```

---

## 📸 Screenshots

> Add screenshots of the Patient Dashboard, Doctor Schedule view, and Admin Panel here.

---

## 🔮 Future Improvements

- Email / SMS appointment reminders
- Real-time notifications using WebSocket
- Doctor availability calendar view
- Deploy on Render / Railway with live demo

---

## 👤 Author

**Darshan S**
- GitHub: [@Darshan7484](https://github.com/Darshan7484)
- LinkedIn: [darshan-s-75893b24b](https://linkedin.com/in/darshan-s-75893b24b)
- Email: darshandarahu044@gmail.com

---

## 📜 License

This project is licensed under the MIT License.
