import { useState, useCallback } from 'react';
import { authAPI } from '../services/api';
import { useNotifications } from './useNotifications';

/**
 * Custom Hook: useOTP
 * Handles OTP generation, verification, and state management
 */
export function useOTP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const { success, error: showError } = useNotifications();

  /**
   * Request OTP to be sent
   * @param {string} email - User email address
   * @param {string} type - OTP type (LOGIN, EMAIL_VERIFY, PASSWORD_RESET, MFA)
   * @returns {Promise<boolean>} - Success status
   */
  const requestOTP = useCallback(async (email, type = 'LOGIN') => {
    try {
      setLoading(true);
      setError('');

      const response = await authAPI.requestOTP({ email, type });

      if (response.status === 200 || response.status === 201) {
        success(`OTP sent to ${email}`);
        setOtpSent(true);
        setTimeRemaining(300); // 5 minutes
        return true;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to send OTP';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  /**
   * Verify OTP code
   * @param {string} email - User email address
   * @param {string} code - OTP code to verify
   * @param {string} type - OTP type
   * @returns {Promise<boolean>} - Success status
   */
  const verifyOTP = useCallback(async (email, code, type = 'LOGIN') => {
    try {
      setLoading(true);
      setError('');

      const response = await authAPI.verifyOTP({ email, code, type });

      if (response.status === 200) {
        success('OTP verified successfully');
        setOtpSent(false);
        return true;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid OTP code';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  /**
   * Resend OTP with cooldown check
   * @param {string} email - User email address
   * @param {string} type - OTP type
   * @returns {Promise<boolean>} - Success status
   */
  const resendOTP = useCallback(async (email, type = 'LOGIN') => {
    try {
      setLoading(true);
      setError('');

      const response = await authAPI.resendOTP({ email, type });

      if (response.status === 200) {
        success('New OTP sent to your email');
        setTimeRemaining(300); // Reset timer
        return true;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to resend OTP';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [success, showError]);

  /**
   * Clear OTP state
   */
  const clearOTP = useCallback(() => {
    setOtpSent(false);
    setError('');
    setTimeRemaining(0);
  }, []);

  /**
   * Set error message
   */
  const setErrorMessage = useCallback((message) => {
    setError(message);
  }, []);

  return {
    // State
    loading,
    error,
    otpSent,
    timeRemaining,

    // Methods
    requestOTP,
    verifyOTP,
    resendOTP,
    clearOTP,
    setErrorMessage,
    setTimeRemaining,
  };
}

/**
 * Custom Hook: useOTPTimer
 * Handles OTP timer countdown
 */
export function useOTPTimer(initialSeconds = 300, onExpire) {
  const [seconds, setSeconds] = useState(initialSeconds);

  React.useEffect(() => {
    if (seconds <= 0) {
      onExpire?.();
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onExpire]);

  const resetTimer = () => {
    setSeconds(initialSeconds);
  };

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    seconds,
    isExpired: seconds === 0,
    formatTime,
    resetTimer,
    setSeconds,
  };
}

/**
 * Custom Hook: useOTPInput
 * Handles OTP input field management with auto-focus and paste
 */
export function useOTPInput(length = 6) {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);

  const handleInputChange = useCallback((value, index) => {
    if (!/^\d?$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next field
    if (value && index < length - 1) {
      setActiveIndex(index + 1);
    }

    return newOtp;
  }, [otp, length]);

  const handlePaste = useCallback((pastedText) => {
    const digits = pastedText.replace(/\D/g, '').split('');
    const newOtp = [...otp];

    digits.forEach((digit, i) => {
      if (i < length) {
        newOtp[i] = digit;
      }
    });

    setOtp(newOtp);

    // Focus last filled field
    const lastIndex = Math.min(digits.length - 1, length - 1);
    setActiveIndex(lastIndex);

    return newOtp;
  }, [otp, length]);

  const clearOTP = useCallback(() => {
    setOtp(Array(length).fill(''));
    setActiveIndex(0);
  }, [length]);

  const getOTPCode = useCallback(() => {
    return otp.join('');
  }, [otp]);

  const isComplete = useCallback(() => {
    return otp.every((digit) => digit !== '');
  }, [otp]);

  return {
    otp,
    setOtp,
    activeIndex,
    setActiveIndex,
    handleInputChange,
    handlePaste,
    clearOTP,
    getOTPCode,
    isComplete,
  };
}
