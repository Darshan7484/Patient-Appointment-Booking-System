# Hospital Appointment System - API Quick Reference

## 🔑 Authentication First!

All protected endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📚 ENDPOINTS BY ROLE

### 🔓 PUBLIC - Anyone can access
```
POST   /auth/register              - Create new account
POST   /auth/login                 - Get JWT token
GET    /doctor/all                 - See all doctors
GET    /doctor/{id}                - See doctor details
```

### 👤 AUTHENTICATED - Any logged-in user
```
GET    /user/profile               - View your profile
PUT    /user/profile               - Update your profile
POST   /appointment/book           - Book appointment
GET    /appointment/{id}           - View appointment
GET    /appointment/queue/position/{id} - Check queue position
DELETE /appointment/{id}/cancel    - Cancel your appointment
```

### 👨‍⚕️ DOCTOR - Role: DOCTOR
```
GET    /doctor/{id}/appointments   - View your appointments
GET    /appointment/doctor/{doctorId} - View doctor's appointments
```

### 👨‍💼 ADMIN - Role: ADMIN
```
GET    /admin/users                - List all users
GET    /admin/appointments         - List all appointments
GET    /admin/appointments/pending - View pending
GET    /admin/appointments/completed - View completed
GET    /admin/appointments/cancelled - View cancelled
GET    /admin/statistics           - View statistics
DELETE /admin/users/{id}           - Delete user

GET    /appointment/all            - View all appointments
GET    /appointment/patient/{id}   - View patient's appointments
GET    /appointment/status/{status} - Filter by status
PUT    /appointment/{id}/status    - Change appointment status
DELETE /appointment/{id}           - Delete appointment

GET    /user/{id}                  - Get user details
GET    /user/{id}/appointments     - View user's appointments
DELETE /user/{id}                  - Delete user

POST   /doctor/add                 - Create doctor
GET    /doctor/{id}                - View doctor
PUT    /doctor/{id}                - Update doctor
DELETE /doctor/{id}                - Delete doctor
GET    /doctor/{id}/appointments   - View doctor's appointments
```

---

## 📋 REQUEST/RESPONSE EXAMPLES

### 1️⃣ Register User
**Endpoint**: `POST /auth/register`

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": null,
  "role": "PATIENT",
  "createdAt": "2026-03-17T21:38:42",
  "updatedAt": "2026-03-17T21:38:42"
}
```

---

### 2️⃣ Login
**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6IlBBVElFTiIsImlhdCI6MTcxMDY5OTEyMiwiZXhwIjoxNzEwNzAyNzIyfQ..."
}
```

---

### 3️⃣ Add Doctor (Admin Only)
**Endpoint**: `POST /doctor/add`
**Auth**: Admin token required

**Request**:
```json
{
  "name": "Dr. Sarah Smith",
  "specialization": "Cardiology",
  "department": "Heart Care",
  "contactNumber": "+1-800-123-4567",
  "availableTime": "Monday to Friday, 9AM-5PM"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "name": "Dr. Sarah Smith",
  "specialization": "Cardiology",
  "department": "Heart Care",
  "contactNumber": "+1-800-123-4567",
  "availableTime": "Monday to Friday, 9AM-5PM"
}
```

---

### 4️⃣ Book Appointment
**Endpoint**: `POST /appointment/book`
**Auth**: Any authenticated user

**Request**:
```json
{
  "patientName": "John Doe",
  "patientEmail": "john@example.com",
  "patientId": 1,
  "doctorName": "Dr. Sarah Smith",
  "doctorId": 1,
  "date": "2026-03-25T14:30:00"
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "patientId": 1,
  "doctorId": 1,
  "patientName": "John Doe",
  "doctorName": "Dr. Sarah Smith",
  "patientEmail": "john@example.com",
  "date": "2026-03-25T14:30:00",
  "status": "PENDING",
  "reminderSent": false
}
```

---

### 5️⃣ Update Appointment Status (Admin Only)
**Endpoint**: `PUT /appointment/{id}/status`
**Auth**: Admin token required

**Request**:
```json
{
  "status": "CONFIRMED",
  "reason": null
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "patientId": 1,
  "doctorId": 1,
  "patientName": "John Doe",
  "doctorName": "Dr. Sarah Smith",
  "patientEmail": "john@example.com",
  "date": "2026-03-25T14:30:00",
  "status": "CONFIRMED",
  "reminderSent": false
}
```

---

### 6️⃣ Get User Profile
**Endpoint**: `GET /user/profile`
**Auth**: User token required

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-1234",
  "role": "PATIENT",
  "createdAt": "2026-03-17T21:38:42",
  "updatedAt": "2026-03-17T21:38:42"
}
```

---

### 7️⃣ Update User Profile
**Endpoint**: `PUT /user/profile`
**Auth**: User token required

**Request**:
```json
{
  "name": "John Doe Updated",
  "email": "john.new@example.com",
  "phone": "+1-555-5678",
  "password": "newpassword123"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "John Doe Updated",
  "email": "john.new@example.com",
  "phone": "+1-555-5678",
  "role": "PATIENT",
  "createdAt": "2026-03-17T21:38:42",
  "updatedAt": "2026-03-17T21:40:15"
}
```

---

### 8️⃣ Cancel Appointment
**Endpoint**: `DELETE /appointment/{id}/cancel`
**Auth**: Authenticated user required

**Response** (200 OK):
```json
{
  "id": 1,
  "patientId": 1,
  "doctorId": 1,
  "patientName": "John Doe",
  "doctorName": "Dr. Sarah Smith",
  "patientEmail": "john@example.com",
  "date": "2026-03-25T14:30:00",
  "status": "CANCELLED",
  "reminderSent": false
}
```

---

### 9️⃣ Get Admin Statistics
**Endpoint**: `GET /admin/statistics`
**Auth**: Admin token required

**Response** (200 OK):
```json
{
  "totalAppointments": 15,
  "pendingAppointments": 3,
  "completedAppointments": 10,
  "cancelledAppointments": 2,
  "totalUsers": 25
}
```

---

### 🔟 Get Queue Position
**Endpoint**: `GET /appointment/queue/position/{patientId}`
**Auth**: Authenticated user required

**Response** (200 OK):
```json
3
```
(User is 3rd in queue)

---

## ⚠️ ERROR RESPONSES

### 400 Bad Request - Validation Failed
```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": [
    "email: Email should be valid",
    "password: Password must be at least 6 characters"
  ],
  "timestamp": "2026-03-17T21:38:42"
}
```

### 401 Unauthorized - Invalid Credentials
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": "2026-03-17T21:38:42"
}
```

### 403 Forbidden - Insufficient Permissions
```json
{
  "status": 403,
  "message": "Access Denied",
  "timestamp": "2026-03-17T21:38:42"
}
```

### 404 Not Found - Resource not found
```json
{
  "status": 404,
  "message": "Appointment not found with id: 999",
  "timestamp": "2026-03-17T21:38:42"
}
```

### 500 Internal Server Error
```json
{
  "status": 500,
  "message": "An error occurred",
  "timestamp": "2026-03-17T21:38:42"
}
```

---

## 🔐 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| **200** | OK | Successful GET, PUT |
| **201** | Created | Successful POST (resource created) |
| **204** | No Content | Successful DELETE |
| **400** | Bad Request | Validation errors |
| **401** | Unauthorized | Missing/invalid JWT token |
| **403** | Forbidden | User lacks required role |
| **404** | Not Found | Resource doesn't exist |
| **500** | Server Error | Unexpected error |

---

## 🛠️ POSTMAN SETUP

### 1. Create Environment
```
Variable: base_url
Value: http://localhost:8080

Variable: token
Value: (will be filled after login)
```

### 2. Login Request (save token)
```
Method: POST
URL: {{base_url}}/auth/login
Body: {"email": "john@example.com", "password": "password123"}
Tests:
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
```

### 3. Any Protected Request
```
Method: GET/POST/PUT/DELETE
URL: {{base_url}}/endpoint
Headers:
  Authorization: Bearer {{token}}
```

---

## 📞 TROUBLESHOOTING

| Error | Cause | Solution |
|-------|-------|----------|
| `JWT expired` | Token is old | Login again to get new token |
| `Access Denied` | Wrong role | Use account with correct role |
| `Doctor already has an appointment` | Time conflict | Choose different time |
| `Validation failed` | Invalid input | Check field formats |
| `Database Connection Failed` | DB not running | Start MySQL server |

---

**🎉 Your backend is ready! Start building your frontend now!**

