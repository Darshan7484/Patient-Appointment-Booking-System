import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { formatDate, formatTime, getStatusBadgeClass } from '../../utils/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, apptRes] = await Promise.all([
          adminAPI.getStatistics(),
          adminAPI.getAllAppointments(),
        ]);
        setStats(statsRes.data);
        setRecentAppointments((apptRes.data || []).slice(0, 6));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <div className="spinner-border text-danger" />
    </div>
  );

  const statCards = [
    { label: 'Total Appointments', value: stats?.totalAppointments ?? '—', icon: 'bi-calendar', color: 'primary' },
    { label: 'Pending', value: stats?.pendingAppointments ?? '—', icon: 'bi-hourglass-split', color: 'warning' },
    { label: 'Completed', value: stats?.completedAppointments ?? '—', icon: 'bi-check2-circle', color: 'success' },
    { label: 'Cancelled', value: stats?.cancelledAppointments ?? '—', icon: 'bi-x-circle', color: 'danger' },
    { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: 'bi-people', color: 'info' },
    { label: 'Total Doctors', value: stats?.totalDoctors ?? '—', icon: 'bi-person-badge', color: 'secondary' },
  ];

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0"><i className="bi bi-shield-check text-danger me-2"></i>Admin Dashboard</h3>
          <p className="text-muted mb-0">Hospital management overview</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/admin/doctors" className="btn btn-outline-success btn-sm">
            <i className="bi bi-person-badge me-1"></i>Manage Doctors
          </Link>
          <Link to="/admin/appointments" className="btn btn-danger btn-sm">
            <i className="bi bi-calendar-check me-1"></i>All Appointments
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        {statCards.map((s) => (
          <div className="col-6 col-md-4 col-lg-2" key={s.label}>
            <div className={`card border-0 bg-${s.color} bg-opacity-10 h-100`}>
              <div className="card-body text-center py-3">
                <div className={`text-${s.color} fs-3 mb-1`}><i className={`bi ${s.icon}`}></i></div>
                <div className="fs-4 fw-bold">{s.value}</div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="row g-3 mb-4">
        {[
          { to: '/admin/users', label: 'Manage Users', icon: 'bi-people-fill', color: 'primary', desc: 'View & delete users' },
          { to: '/admin/doctors', label: 'Manage Doctors', icon: 'bi-person-badge-fill', color: 'success', desc: 'Add, edit, remove doctors' },
          { to: '/admin/appointments', label: 'Appointments', icon: 'bi-calendar-week-fill', color: 'warning', desc: 'View & update status' },
        ].map(({ to, label, icon, color, desc }) => (
          <div className="col-md-4" key={to}>
            <Link to={to} className="text-decoration-none">
              <div className={`card border-0 shadow-sm border-start border-${color} border-4 h-100`} style={{ borderLeft: `4px solid var(--bs-${color})` }}>
                <div className="card-body d-flex align-items-center gap-3">
                  <div className={`bg-${color} bg-opacity-15 rounded-3 p-3`}>
                    <i className={`bi ${icon} text-${color} fs-3`}></i>
                  </div>
                  <div>
                    <div className="fw-bold">{label}</div>
                    <div className="small text-muted">{desc}</div>
                  </div>
                  <i className="bi bi-chevron-right ms-auto text-muted"></i>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h5 className="mb-0 fw-bold"><i className="bi bi-clock-history me-2 text-danger"></i>Recent Appointments</h5>
          <Link to="/admin/appointments" className="btn btn-outline-danger btn-sm">View All</Link>
        </div>
        <div className="card-body p-0">
          {recentAppointments.length === 0 ? (
            <div className="text-center py-4 text-muted">No appointments yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr><th>#</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recentAppointments.map((apt, i) => (
                    <tr key={apt.id}>
                      <td className="text-muted small">{i + 1}</td>
                      <td>{apt.patientName || `#${apt.patientId}`}</td>
                      <td>{apt.doctorName || `#${apt.doctorId}`}</td>
                      <td>{formatDate(apt.date, 'short')}</td>
                      <td>
                        <span className={`badge bg-${getStatusBadgeClass(apt.status)}`}>
                          {apt.status}
                        </span>
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
