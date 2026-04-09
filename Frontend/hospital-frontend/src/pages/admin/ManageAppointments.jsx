import React, { useEffect, useState } from 'react';
import { adminAPI, appointmentAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { formatDate, formatTime, getStatusIcon, getStatusBadgeClass } from '../../utils/format';

const ALL_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    adminAPI.getAllAppointments()
      .then(res => setAppointments(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      const res = await appointmentAPI.updateStatus(id, newStatus);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: res.data.status } : a));
      addNotification(`Appointment status updated to ${newStatus}`, 'success');
    } catch {
      addNotification('Failed to update status', 'error');
    }
    finally { setUpdating(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment permanently?')) return;
    try {
      await appointmentAPI.delete(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
      addNotification('Appointment deleted successfully', 'success');
    } catch {
      addNotification('Failed to delete appointment', 'error');
    }
  };

  const filtered = appointments
    .filter(a => filter === 'ALL' || a.status === filter)
    .filter(a =>
      !search ||
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase())
    );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <div className="spinner-border text-danger" />
    </div>
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold"><i className="bi bi-calendar-check text-danger me-2"></i>Manage Appointments</h3>
          <p className="text-muted mb-0">{appointments.length} total appointments</p>
        </div>
        <div className="input-group" style={{ maxWidth: 260 }}>
          <span className="input-group-text bg-light border-end-0"><i className="bi bi-search text-muted"></i></span>
          <input type="text" className="form-control border-start-0"
            placeholder="Search patient or doctor..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-3">
        {['ALL', ...ALL_STATUSES].map(s => (
          <button
            key={s}
            className={`btn btn-sm me-2 mb-2 ${filter === s ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(s)}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            <span className="badge bg-white text-dark ms-1">
              {s === 'ALL' ? appointments.length : appointments.filter(a => a.status === s).length}
            </span>
          </button>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>No appointments found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th><th>Patient</th><th>Doctor</th><th>Date & Time</th>
                    <th>Status</th><th>Change Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apt, i) => (
                    <tr key={apt.id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td>
                        <div className="fw-semibold">{apt.patientName || `#${apt.patientId}`}</div>
                        <div className="small text-muted">{apt.patientEmail}</div>
                      </td>
                      <td>{apt.doctorName || `#${apt.doctorId}`}</td>
                      <td>
                        <div>{formatDate(apt.date, 'short')}</div>
                        <div className="small text-muted">{formatTime(apt.date)}</div>
                      </td>
                      <td>
                        <span className={`badge bg-${getStatusBadgeClass(apt.status)} px-2 py-2`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ minWidth: 130 }}
                          value={apt.status}
                          disabled={updating === apt.id}
                          onChange={e => handleStatusChange(apt.id, e.target.value)}
                        >
                          {ALL_STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(apt.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
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
