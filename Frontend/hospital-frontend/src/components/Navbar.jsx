import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'DOCTOR') return '/doctor';
    return '/patient';
  };

  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  const roleColor = user?.role === 'ADMIN' ? 'danger' : user?.role === 'DOCTOR' ? 'success' : 'primary';
  const roleLabel = user?.role === 'ADMIN' ? 'Admin' : user?.role === 'DOCTOR' ? 'Doctor' : 'Patient';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #0f4c81, #1a73e8)' }}>
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to={getDashboardPath()}>
          <i className="bi bi-hospital me-2"></i>MediCare
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {user && (
            <ul className="navbar-nav me-auto">
              {user.role === 'PATIENT' && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/patient')}`} to="/patient">
                      <i className="bi bi-speedometer2 me-1"></i>Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/patient/book')}`} to="/patient/book">
                      <i className="bi bi-calendar-plus me-1"></i>Book Appointment
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/patient/appointments')}`} to="/patient/appointments">
                      <i className="bi bi-calendar-check me-1"></i>My Appointments
                    </Link>
                  </li>
                </>
              )}
              {user.role === 'DOCTOR' && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/doctor')}`} to="/doctor">
                      <i className="bi bi-speedometer2 me-1"></i>Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/doctor/appointments')}`} to="/doctor/appointments">
                      <i className="bi bi-calendar-check me-1"></i>My Appointments
                    </Link>
                  </li>
                </>
              )}
              {user.role === 'ADMIN' && (
                <>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/admin')}`} to="/admin">
                      <i className="bi bi-speedometer2 me-1"></i>Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/admin/users')}`} to="/admin/users">
                      <i className="bi bi-people me-1"></i>Users
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/admin/appointments')}`} to="/admin/appointments">
                      <i className="bi bi-calendar-check me-1"></i>Appointments
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className={`nav-link ${isActive('/admin/doctors')}`} to="/admin/doctors">
                      <i className="bi bi-person-badge me-1"></i>Doctors
                    </Link>
                  </li>
                </>
              )}
            </ul>
          )}

          {user ? (
            <div className="d-flex align-items-center gap-2">
              <span className={`badge bg-${roleColor} fs-6 px-3 py-2`}>
                <i className="bi bi-person-circle me-1"></i>
                {user.email} · {roleLabel}
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
              <Link className="btn btn-light btn-sm text-primary fw-semibold" to="/register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
