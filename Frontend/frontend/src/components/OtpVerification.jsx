import { useState, useEffect, useRef } from 'react';
import './OtpVerification.css';

/**
 * OTP Verification Component
 * Displays input fields for OTP codes with auto-focus and real-time validation
 */
export default function OtpVerification({
  otpLength = 6,
  onComplete,
  onResend,
  loading = false,
  error = '',
  timeRemaining = 300, // 5 minutes
  type = 'LOGIN'
}) {
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(timeRemaining);
  const [showResend, setShowResend] = useState(false);
  const inputRefs = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) {
      setShowResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Handle input change
  const handleInputChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next field
    if (value && index < otpLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all fields filled
    if (newOtp.every(digit => digit !== '')) {
      submitOtp(newOtp.join(''));
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').split('');

    if (digits.length > 0) {
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (i < otpLength) {
          newOtp[i] = digit;
        }
      });
      setOtp(newOtp);

      // Focus last filled field
      const lastIndex = Math.min(digits.length - 1, otpLength - 1);
      inputRefs.current[lastIndex]?.focus();

      // Auto-submit if all fields filled
      if (newOtp.every(digit => digit !== '')) {
        submitOtp(newOtp.join(''));
      }
    }
  };

  // Submit OTP
  const submitOtp = (code) => {
    if (code.length === otpLength && !loading) {
      onComplete?.(code);
    }
  };

  // Handle resend
  const handleResend = () => {
    setOtp(Array(otpLength).fill(''));
    setTimer(timeRemaining);
    setShowResend(false);
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
    onResend?.();
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isExpired = timer === 0;

  return (
    <div className="otp-verification">
      <div className="otp-container">
        <h2 className="otp-title">🔐 Enter Verification Code</h2>
        <p className="otp-description">
          We've sent a {otpLength}-digit code to your registered email address.
          Please enter it below.
        </p>

        {/* OTP Input Fields */}
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              onFocus={() => setActiveIndex(index)}
              disabled={loading}
              className={`otp-input ${digit ? 'filled' : ''} ${
                activeIndex === index ? 'active' : ''
              }`}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="otp-error">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {error}
          </div>
        )}

        {/* Timer */}
        <div className={`otp-timer ${isExpired ? 'expired' : ''}`}>
          <i className={`bi ${isExpired ? 'bi-exclamation-triangle-fill' : 'bi-hourglass-split'} me-2`}></i>
          {isExpired ? (
            <span>Code expired. Please request a new one.</span>
          ) : (
            <span>Code expires in: <strong>{formatTime(timer)}</strong></span>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="btn btn-primary w-100 mt-3"
          onClick={() => submitOtp(otp.join(''))}
          disabled={loading || otp.some(d => d === '') || isExpired}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Verifying...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Verify Code
            </>
          )}
        </button>

        {/* Resend Option */}
        {showResend ? (
          <div className="otp-resend mt-3 text-center">
            <p className="text-muted mb-2">Didn't receive the code?</p>
            <button
              className="btn btn-link"
              onClick={handleResend}
              disabled={loading}
            >
              <i className="bi bi-arrow-repeat me-1"></i>
              Resend Code
            </button>
          </div>
        ) : (
          <div className="otp-resend mt-3 text-center">
            <p className="text-muted mb-0 small">
              Didn't receive it? You can request a new code in {formatTime(timer)}
            </p>
          </div>
        )}

        {/* Help Text */}
        <div className="otp-help mt-4 p-3 bg-light rounded">
          <p className="small text-muted mb-2">
            <i className="bi bi-info-circle me-2"></i>
            <strong>Tips:</strong>
          </p>
          <ul className="small text-muted mb-0">
            <li>You can paste the code directly into the first field</li>
            <li>Use arrow keys to navigate between fields</li>
            <li>Code expires after {Math.floor(timeRemaining / 60)} minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
