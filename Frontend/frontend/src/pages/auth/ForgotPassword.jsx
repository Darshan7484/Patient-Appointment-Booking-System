import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Toast from '../../components/Toast';
import '../../styles/AuthPages.css';

const ForgotPassword = () => {
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
      const response = await axios.post('http://localhost:8080/auth/forgot-password', {
        email: email
      });
      setMessage(response.data.message);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Check Your Email</h2>
          <Toast type="success" message={message} />
          <div className="text-center mt-4">
            <p className="text-muted">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-muted">
              Please check your email and click the link to reset your password.
            </p>
            <p className="text-muted small">
              The link will expire in 1 hour.
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
        <h2 className="auth-title">Forgot Your Password?</h2>
        <p className="text-muted text-center mb-4">
          Enter your email address and we'll send you a link to reset your password.
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
            {loading ? 'Sending Email...' : 'Send Reset Link'}
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

export default ForgotPassword;
