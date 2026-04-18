import React, { useEffect, useState } from 'react';
import { adminAPI, appointmentAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import SearchFilter from '../../components/SearchFilter';
import { formatDate, formatTime, getStatusIcon, getStatusBadgeClass } from '../../utils/format';

const ALL_STATUSES = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [updating, setUpdating] = useState(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    adminAPI.getAllAppointments()
      .then(res => setAppointments(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filter by status
  const statusFiltered = appointments.filter(a => 
    filter === 'ALL' || a.status === filter
  );

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

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <div className="spinner-border text-danger" />
    </div>
  );

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h3 className="fw-bold mb-1"><i className="bi bi-calendar-check text-danger me-2"></i>Manage Appointments</h3>
        <p className="text-muted">{appointments.length} total appointments in system</p>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        data={statusFiltered}
        searchFields={['patientName', 'patientEmail', 'doctorName']}
        onFiltered={setFilteredAppointments}
        placeholder="Search by patient name, email, or doctor..."
        showAdvanced={true}
      />

      {/* Status Filter Tabs */}
      <div className="mb-3 d-flex gap-2 flex-wrap">
        {['ALL', ...ALL_STATUSES].map(s => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-danger' : 'btn-outline-secondary'}`}
            onClick={() => setFilter(s)}
          >
            <i className={`bi ${getStatusIcon(s === 'ALL' ? 'PENDING' : s)} me-1`}></i>
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            <span className="badge bg-white text-dark ms-1">
              {s === 'ALL' ? appointments.length : appointments.filter(a => a.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Appointments Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
              <p className="mb-0">No appointments found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Change Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((apt, i) => (
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
