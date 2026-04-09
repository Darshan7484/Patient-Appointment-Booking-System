# MediCare Hospital Appointment System - Frontend

A modern React-based frontend for the Hospital Appointment Booking System with role-based access control and comprehensive appointment management.

## ✨ Features Implemented

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure login/registration system
- **Role-Based Access Control**:
  - 👤 **Patient**: Book appointments, view own appointments, cancel bookings
  - 👨‍⚕️ **Doctor**: View patient appointments, manage schedule
  - 🏥 **Admin**: Manage users, doctors, and all appointments

### 📅 Patient Features
- Patient registration and profile management
- Book appointments with available doctors
- View doctor availability schedules
- Cancel appointments (before completion)
- Live queue position tracking
- View appointment history with status tracking
- Appointment reminders notification system

### 👨‍⚕️ Doctor Features
- View all patient appointments
- Filter appointments by status
- Monitor queue numbers
- Track today's appointments
- View patient information

### 🏥 Admin Features
- **User Management**: View and manage all users
- **Doctor Management**: Add, edit, delete doctors
- **Appointment Management**: View all appointments, update status, delete records
- **Dashboard Statistics**: Total appointments, pending, completed, canceled counts
- **System Overview**: Quick access to all management features

### 🔔 Notification System
- Toast notifications for all user actions
- Success/Error/Warning notification types
- Auto-closing notifications (4 seconds default)
- Persistent notification container

### 🎨 UI/UX Features
- Responsive Bootstrap 5 design
- Interactive navbar with role-based navigation
- Professional card-based layouts
- Status badges with color coding
- Loading states and spinner animations
- Date/time formatting utilities
- Search and filter capabilities
- Modal dialogs for forms

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Main navigation bar
│   ├── ProtectedRoute.jsx      # Route protection component
│   ├── Toast.jsx               # Toast notification component
│   ├── NotificationContainer.jsx # Notification container
│   ├── Pagination.jsx          # Pagination component
│   └── DoctorAvailabilityDisplay.jsx # Doctor availability display
├── context/
│   ├── AuthContext.jsx         # Authentication context
│   └── NotificationContext.jsx # Notification context
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── patient/
│   │   ├── PatientDashboard.jsx
│   │   ├── BookAppointment.jsx
│   │   └── MyAppointments.jsx
│   ├── doctor/
│   │   └── DoctorDashboard.jsx
│   └── admin/
│       ├── AdminDashboard.jsx
│       ├── ManageUsers.jsx
│       ├── ManageAppointments.jsx
│       └── ManageDoctors.jsx
├── services/
│   └── api.js                  # API service with axios
├── utils/
│   └── format.js               # Formatting utilities
├── App.jsx                     # Main app component
└── index.js                    # Entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:8081`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

## 🔌 API Integration

The frontend communicates with the backend via REST API endpoints:

### Auth Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### User Endpoints
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update profile
- `GET /user/{id}/appointments` - Get user's appointments

### Doctor Endpoints
- `GET /doctor/all` - Get all doctors
- `GET /doctor/{id}` - Get doctor details
- `POST /doctor/add` - Add new doctor (Admin)
- `PUT /doctor/{id}` - Update doctor (Admin)
- `DELETE /doctor/{id}` - Delete doctor (Admin)

### Appointment Endpoints
- `POST /appointment/book` - Book appointment
- `GET /appointment/all` - Get all appointments
- `GET /appointment/patient/{id}` - Get patient's appointments
- `GET /appointment/doctor/{id}` - Get doctor's appointments
- `PUT /appointment/{id}/status` - Update appointment status
- `DELETE /appointment/{id}/cancel` - Cancel appointment
- `GET /appointment/queue/position/{id}` - Get queue position

### Admin Endpoints
- `GET /admin/users` - Get all users
- `GET /admin/appointments` - Get all appointments
- `GET /admin/statistics` - Get system statistics

## 🎯 Key Components

### AuthContext
Manages JWT authentication and user state globally.

```javascript
const { user, login, logout, loading } = useAuth();
```

### NotificationContext
Provides toast notification system.

```javascript
const { addNotification, removeNotification } = useNotification();
addNotification('Success message', 'success');
```

### Utility Functions
Located in `utils/format.js`:
- `formatDate()` - Format dates in various formats
- `formatTime()` - Format time
- `getStatusBadgeClass()` - Get color for status badges
- `getStatusIcon()` - Get icon for status
- `getRoleBadgeClass()` - Get color for role badges
- `getQueueInfo()` - Get queue position info
- `isAppointmentSoon()` - Check if appointment is upcoming
- `isValidEmail()` - Email validation
- `isValidPhone()` - Phone validation

## 🛡️ Security Features

- JWT token stored in localStorage
- Automatic token refresh on requests
- Auto-logout on 401 Unauthorized (expired token)
- Route protection based on user roles
- Protected appointment operations

## 📱 Responsive Design

- Mobile-friendly Bootstrap 5 grid
- Collapsible navigation menu
- Touch-friendly buttons and inputs
- Optimized for all screen sizes

## 🎨 Styling

- Bootstrap 5 CSS framework
- Bootstrap Icons library
- Custom global styles in `index.css`
- Card hover effects
- Smooth transitions

## 🔄 State Management

- React Hooks (useState, useEffect, useContext)
- Auth context for global authentication state
- Notification context for global notification state
- Local component state for forms and UI

## 📝 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests (if configured)
npm test
```

## 🐛 Troubleshooting

### Backend connection issues
- Ensure backend is running on `http://localhost:8081`
- Check CORS configuration in backend
- Verify API endpoints in `services/api.js`

### Authentication issues
- Clear browser localStorage
- Check JWT token expiration
- Verify login credentials
- Check browser console for errors

### UI/Display issues
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- Check browser console for errors
- Verify Bootstrap CSS is loaded

## 📦 Dependencies

- **react**: UI framework
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **bootstrap**: UI framework
- **bootstrap-icons**: Icon library
- **jwt-decode**: JWT token decoding

## 🚀 Future Enhancements

- Appointment reminders via email/SMS
- Doctor ratings and reviews
- Prescription management
- Appointment rescheduling
- Real-time notifications with WebSockets
- Payment integration
- Video consultation support
- Detailed appointment history

## 📄 License

This project is part of the Hospital Appointment Booking System.

## 👥 Support

For issues or questions, please refer to the backend documentation or contact the development team.
