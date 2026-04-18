import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Toast from '../../components/Toast';
import '../../styles/AuthPages.css';

const ResendVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Email is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resendVerificationEmail({ email });
      setMessage(response.data.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend verification email. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Email Sent</h2>
          <Toast type="success" message={message} />
          <div className="text-center mt-4">
            <p className="text-muted">
              We've sent a verification email to <strong>{email}</strong>
            </p>
            <p className="text-muted">
              Please check your email and click the verification link.
            </p>
            <p className="text-muted small">
              The link will expire in 24 hours.
            </p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary w-100 mt-3"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Resend Verification Email</h2>
        <p className="text-muted text-center mb-4">
          Enter your email address and we'll send you a new verification link.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          {error && <Toast type="danger" message={error} />}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? 'Sending Email...' : 'Resend Verification Email'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            onClick={() => navigate('/login')}
            className="btn btn-link text-decoration-none"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
