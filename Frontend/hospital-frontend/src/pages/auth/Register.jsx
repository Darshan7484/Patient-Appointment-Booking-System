import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.register({ name: form.name, email: form.email, password: form.password });
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #e8f4fd, #d0e8ff)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                <i className="bi bi-hospital fs-3"></i>
              </div>
              <h2 className="fw-bold text-primary">MediCare</h2>
              <p className="text-muted">Create your patient account</p>
            </div>

            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4">
                <h4 className="fw-bold mb-1">Get started</h4>
                <p className="text-muted small mb-4">Register as a patient</p>

                {error && <div className="alert alert-danger d-flex align-items-center py-2"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}
                {success && <div className="alert alert-success d-flex align-items-center py-2"><i className="bi bi-check-circle me-2"></i>{success}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-person text-muted"></i></span>
                      <input type="text" name="name" className="form-control border-start-0 ps-0"
                        placeholder="John Doe" value={form.name} onChange={handleChange} required minLength={2} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-envelope text-muted"></i></span>
                      <input type="email" name="email" className="form-control border-start-0 ps-0"
                        placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock text-muted"></i></span>
                      <input type="password" name="password" className="form-control border-start-0 ps-0"
                        placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required minLength={6} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0"><i className="bi bi-lock-fill text-muted"></i></span>
                      <input type="password" name="confirmPassword" className="form-control border-start-0 ps-0"
                        placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</> : 'Create Account'}
                  </button>
                </form>

                <hr className="my-4" />
                <p className="text-center text-muted small mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-semibold text-decoration-none">Sign in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
