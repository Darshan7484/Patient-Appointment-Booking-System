import React, { useEffect, useState } from 'react';
import { doctorAPI, userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatTime, getStatusBadgeClass } from '../../utils/format';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    async function load() {
      try {
        // Get all doctors, find the one matching logged-in user email
        const allDoctors = await doctorAPI.getAll();
        const matched = allDoctors.data?.find(d => d.email === user?.email);
        if (matched) {
          setDoctorProfile(matched);
          const apptRes = await doctorAPI.getDoctorAppointments(matched.id);
          setAppointments(apptRes.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    today: appointments.filter(a => a.date && new Date(a.date).toDateString() === new Date().toDateString()).length,
  };

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <div className="spinner-border text-success" />
    </div>
  );

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h3 className="fw-bold mb-0">
            <i className="bi bi-person-badge text-success me-2"></i>
            {doctorProfile ? `Dr. ${doctorProfile.name}` : user?.email}
          </h3>
          {doctorProfile && (
            <p className="text-muted mb-0">
              {doctorProfile.specialization}
              {doctorProfile.experience && ` · ${doctorProfile.experience} years experience`}
            </p>
          )}
        </div>
        <span className="badge bg-success px-3 py-2 fs-6">
          <i className="bi bi-circle-fill me-1" style={{ fontSize: 8 }}></i>On Duty
        </span>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Patients', value: stats.total, icon: 'bi-people', color: 'primary' },
          { label: "Today's Appointments", value: stats.today, icon: 'bi-calendar-day', color: 'success' },
          { label: 'Pending', value: stats.pending, icon: 'bi-hourglass-split', color: 'warning' },
          { label: 'Completed', value: stats.completed, icon: 'bi-check2-circle', color: 'info' },
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

      {/* Appointments Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <h5 className="mb-0 fw-bold"><i className="bi bi-calendar-week me-2 text-success"></i>My Appointments</h5>
          <div>
            {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
              <button
                key={s}
                className={`btn btn-sm me-1 ${filter === s ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setFilter(s)}
              >
                {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-x fs-1 d-block mb-2"></i>
              No appointments found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Email</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Queue</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((apt, i) => (
                    <tr key={apt.id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td>
                        <i className="bi bi-person-circle text-primary me-2"></i>
                        {apt.patientName || `Patient #${apt.patientId}`}
                      </td>
                      <td className="text-muted small">{apt.patientEmail || '—'}</td>
                      <td>
                        <div>{formatDate(apt.date, 'short')}</div>
                        <div className="small text-muted">{formatTime(apt.date)}</div>
                      </td>
                      <td>
                        <span className={`badge bg-${getStatusBadgeClass(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td>{apt.queueNumber ? `#${apt.queueNumber}` : '—'}</td>
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
