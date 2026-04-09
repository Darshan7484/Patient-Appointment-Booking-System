import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorAPI, appointmentAPI, userAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { formatDate } from '../../utils/format';
import DoctorAvailabilityDisplay from '../../components/DoctorAvailabilityDisplay';

export default function BookAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ doctorId: '', date: '', time: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  useEffect(() => {
    async function load() {
      try {
        const [dRes, pRes] = await Promise.all([doctorAPI.getAll(), userAPI.getProfile()]);
        setDoctors(dRes.data || []);
        setProfile(pRes.data);
      } catch (e) {
        setError('Failed to load data.');
      }
    }
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.date || !form.time) {
      setError('Please fill in all fields.');
      addNotification('Please fill in all fields', 'warning');
      return;
    }
    setLoading(true);
    setError('');
    const selectedDoctor = doctors.find(d => String(d.id) === String(form.doctorId));
    const dateTime = `${form.date}T${form.time}:00`;
    try {
      await appointmentAPI.book({
        patientName: profile?.name,
        patientEmail: profile?.email,
        patientId: profile?.id,
        doctorName: selectedDoctor?.name,
        doctorId: Number(form.doctorId),
        date: dateTime,
      });
      setSuccess('Appointment booked successfully!');
      addNotification('Appointment booked successfully!', 'success');
      setTimeout(() => navigate('/patient/appointments'), 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data || 'Booking failed.';
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Min date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="mb-4">
            <h3 className="fw-bold"><i className="bi bi-calendar-plus text-primary me-2"></i>Book an Appointment</h3>
            <p className="text-muted">Choose your doctor and preferred time slot.</p>
          </div>

          {error && <div className="alert alert-danger"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
          {success && <div className="alert alert-success"><i className="bi bi-check-circle me-2"></i>{success}</div>}

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              {/* Patient info preview */}
              {profile && (
                <div className="alert alert-light border mb-4 d-flex align-items-center">
                  <i className="bi bi-person-circle fs-4 text-primary me-3"></i>
                  <div>
                    <strong>{profile.name}</strong>
                    <div className="small text-muted">{profile.email}</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Select Doctor</label>
                  <select
                    className="form-select"
                    value={form.doctorId}
                    onChange={e => setForm({ ...form, doctorId: e.target.value })}
                    required
                  >
                    <option value="">-- Choose a doctor --</option>
                    {doctors.map(d => (
                      <option key={d.id} value={d.id}>
                        Dr. {d.name} — {d.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {form.doctorId && (
                  <div className="mb-3 p-3 bg-light rounded-3">
                    {(() => {
                      const doc = doctors.find(d => String(d.id) === String(form.doctorId));
                      return doc ? (
                        <div>
                          <div className="d-flex gap-3 mb-3">
                            <div className="text-success fs-2"><i className="bi bi-person-badge"></i></div>
                            <div>
                              <div className="fw-semibold">Dr. {doc.name}</div>
                              <div className="small text-muted">{doc.specialization}</div>
                              {doc.experience && <div className="small text-muted">{doc.experience} years experience</div>}
                            </div>
                          </div>
                          <DoctorAvailabilityDisplay doctor={doc} />
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Date</label>
                    <input
                      type="date" className="form-control"
                      min={today}
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Time</label>
                    <input
                      type="time" className="form-control"
                      value={form.time}
                      onChange={e => setForm({ ...form, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary px-4 fw-semibold" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Booking...</> : <><i className="bi bi-calendar-check me-2"></i>Confirm Booking</>}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/patient')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
