import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import Toast from '../../components/Toast';
import '../../styles/AuthPages.css';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('No verification token provided. Please check your email link.');
      return;
    }

    const verifyEmail = async () => {
      setLoading(true);
      try {
        const response = await authAPI.verifyEmail({ token });
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Email verification failed. The link may have expired.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Email Verification</h2>
        
        {loading && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Verifying email...</span>
          </div>
        )}

        {message && (
          <>
            <Toast type="success" message={message} />
            <p className="text-muted mt-3">
              Email verified successfully! Redirecting to login in 3 seconds...
            </p>
          </>
        )}

        {error && !loading && (
          <>
            <Toast type="danger" message={error} />
            <div className="mt-3">
              <button 
                onClick={() => navigate('/resend-verification')}
                className="btn btn-primary w-100"
              >
                Resend Verification Email
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
