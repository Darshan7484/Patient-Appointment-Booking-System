import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { formatDate, formatTime, getStatusIcon, getStatusBadgeClass } from '../../utils/format';

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const { addNotification } = useNotification();

  useEffect(() => {
    async function load() {
      try {
        const res = await appointmentAPI.getMy();
        setAppointments(res.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
      addNotification('Appointment cancelled successfully', 'success');
    } catch {
      addNotification('Could not cancel appointment', 'error');
    }
  };

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <div className="spinner-border text-primary" />
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold"><i className="bi bi-calendar-check text-primary me-2"></i>My Appointments</h3>
          <p className="text-muted mb-0">{appointments.length} appointment(s) total</p>
        </div>
        <Link to="/patient/book" className="btn btn-primary">
          <i className="bi bi-plus-lg me-1"></i>Book New
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="mb-3">
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
          <button
            key={s}
            className={`btn btn-sm me-2 mb-2 ${filter === s ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            <span className="badge bg-white text-dark ms-1">
              {s === 'ALL' ? appointments.length : appointments.filter(a => a.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5 text-muted">
            <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
            No {filter === 'ALL' ? '' : filter.toLowerCase()} appointments found.
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(apt => (
            <div className="col-md-6" key={apt.id}>
              <div className="card border-0 shadow-sm h-100">
                <div className={`card-header bg-${getStatusBadgeClass(apt.status)} bg-opacity-10 border-0 d-flex justify-content-between align-items-center`}>
                  <span className={`badge bg-${getStatusBadgeClass(apt.status)} px-3 py-2`}>
                    <i className={`bi bi-${getStatusIcon(apt.status)} me-1`}></i>{apt.status}
                  </span>
                  <small className="text-muted">#{apt.id}</small>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="bi bi-person-badge text-success fs-4"></i>
                    </div>
                    <div>
                      <div className="fw-semibold">Dr. {apt.doctorName || `Doctor #${apt.doctorId}`}</div>
                      <div className="small text-muted">Attending Doctor</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center text-muted small mb-2">
                    <i className="bi bi-calendar3 me-2"></i>
                    {formatDate(apt.date, 'long')}
                  </div>
                  <div className="d-flex align-items-center text-muted small">
                    <i className="bi bi-clock me-2"></i>
                    {formatTime(apt.date)}
                  </div>
                  {apt.queueNumber && (
                    <div className="d-flex align-items-center text-muted small mt-2">
                      <i className="bi bi-list-ol me-2"></i>
                      Queue Position: #{apt.queueNumber}
                    </div>
                  )}
                </div>
                {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                  <div className="card-footer bg-white border-0 pt-0">
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={() => handleCancel(apt.id)}
                    >
                      <i className="bi bi-x-circle me-1"></i>Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
