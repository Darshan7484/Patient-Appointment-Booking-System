# MediCare - Hospital Appointment System Frontend

React + Bootstrap frontend for the Spring Boot Hospital Appointment backend.

## Prerequisites
- Node.js 18+
- Backend running at `http://localhost:8080`

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm start
```

App opens at **http://localhost:3000**

---

## Project Structure

```
src/
├── context/
│   └── AuthContext.jsx        # JWT auth state (login, logout, role)
├── services/
│   └── api.js                 # All Axios API calls to backend
├── components/
│   ├── Navbar.jsx             # Role-aware top navigation
│   └── ProtectedRoute.jsx     # Route guard by role
├── pages/
│   ├── auth/
│   │   ├── Login.jsx          # POST /auth/login
│   │   └── Register.jsx       # POST /auth/register
│   ├── patient/
│   │   ├── PatientDashboard.jsx   # Stats + recent appointments
│   │   ├── BookAppointment.jsx    # POST /appointment/book
│   │   └── MyAppointments.jsx     # GET /user/{id}/appointments
│   ├── doctor/
│   │   └── DoctorDashboard.jsx    # GET /doctor/{id}/appointments
│   └── admin/
│       ├── AdminDashboard.jsx     # GET /admin/statistics
│       ├── ManageUsers.jsx        # GET/DELETE /admin/users
│       ├── ManageAppointments.jsx # GET/PUT/DELETE appointments
│       └── ManageDoctors.jsx      # GET/POST/PUT/DELETE /doctor
```

---

## API Endpoints Used

| Page | Method | Endpoint |
|------|--------|----------|
| Login | POST | `/auth/login` |
| Register | POST | `/auth/register` |
| Patient Dashboard | GET | `/user/profile`, `/user/{id}/appointments` |
| Book Appointment | POST | `/appointment/book` |
| Doctor Dashboard | GET | `/doctor/all`, `/doctor/{id}/appointments` |
| Admin Dashboard | GET | `/admin/statistics`, `/admin/appointments` |
| Manage Users | GET, DELETE | `/admin/users`, `/admin/users/{id}` |
| Manage Appointments | GET, PUT, DELETE | `/admin/appointments`, `/appointment/{id}/status` |
| Manage Doctors | GET, POST, PUT, DELETE | `/doctor/all`, `/doctor/add`, `/doctor/{id}` |

---

## Roles & Routes

| Role | Default Route | Access |
|------|--------------|--------|
| `PATIENT` | `/patient` | Book & view own appointments |
| `DOCTOR` | `/doctor` | View assigned appointments |
| `ADMIN` | `/admin` | Full access to all data |

---

## Backend CORS Configuration

Add this to your Spring Boot `SecurityConfig.java` or a `CorsConfig` bean:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:3000"));
    config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
```

---

## Notes

- JWT token is stored in `localStorage` and auto-attached to all requests
- Token expiry triggers automatic logout and redirect to `/login`
- The `jwtDecode` in `AuthContext` reads the `role` claim from the token
  - Make sure your backend includes `role` in the JWT payload
- Doctor dashboard matches by email — ensure doctor email matches login email
