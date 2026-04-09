import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, appointmentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { formatDate, formatTime, getStatusBadgeClass, getQueueInfo } from '../../utils/format';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [queuePos, setQueuePos] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    async function load() {
      try {
        const profileRes = await userAPI.getProfile();
        setProfile(profileRes.data);
        const apptRes = await appointmentAPI.getMy();
        setAppointments(apptRes.data || []);
        const queueRes = await appointmentAPI.getQueuePosition(profileRes.data.id);
        setQueuePos(queueRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
      addNotification('Appointment cancelled', 'success');
    } catch (e) {
      addNotification('Failed to cancel appointment', 'error');
    }
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">
            <i className="bi bi-person-heart text-primary me-2"></i>
            Welcome, {profile?.name || user?.email}!
          </h3>
          <p className="text-muted mb-0">Manage your appointments and health records</p>
        </div>
        <Link to="/patient/book" className="btn btn-primary px-4">
          <i className="bi bi-calendar-plus me-2"></i>Book Appointment
        </Link>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Appointments', value: stats.total, icon: 'bi-calendar', color: 'primary' },
          { label: 'Pending', value: stats.pending, icon: 'bi-hourglass-split', color: 'warning' },
          { label: 'Confirmed', value: stats.confirmed, icon: 'bi-calendar-check', color: 'info' },
          { label: 'Completed', value: stats.completed, icon: 'bi-check2-circle', color: 'success' },
        ].map((s) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className={`card border-0 bg-${s.color} bg-opacity-10 h-100`}>
              <div className="card-body">
                <div className={`text-${s.color} fs-2 mb-1`}><i className={`bi ${s.icon}`}></i></div>
                <div className="fs-3 fw-bold">{s.value}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Queue Position Banner */}
      {queuePos > 0 && (
        <div className="alert alert-info d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-list-ol fs-4 me-3"></i>
          <div>
            <strong>Your queue position: #{queuePos}</strong>
            <div className="small">You have a pending appointment in the queue.</div>
          </div>
        </div>
      )}

      {/* Recent Appointments */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-bold"><i className="bi bi-clock-history me-2 text-primary"></i>My Appointments</h5>
          <Link to="/patient/appointments" className="btn btn-outline-primary btn-sm">View All</Link>
        </div>
        <div className="card-body p-0">
          {appointments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
              No appointments yet.{' '}
              <Link to="/patient/book" className="text-primary">Book your first one!</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <i className="bi bi-person-badge text-success me-2"></i>
                        {apt.doctorName || `Doctor #${apt.doctorId}`}
                      </td>
                      <td>
                        <div>{formatDate(apt.date, 'short')}</div>
                        <div className="small text-muted">{formatTime(apt.date)}</div>
                      </td>
                      <td>
                        <span className={`badge bg-${getStatusBadgeClass(apt.status)} px-3 py-2`}>
                          {apt.status}
                        </span>
                        {apt.queueNumber && <div className="small text-muted mt-1">Queue: #{apt.queueNumber}</div>}
                      </td>
                      <td>
                        {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleCancel(apt.id)}
                          >
                            <i className="bi bi-x-circle me-1"></i>Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
