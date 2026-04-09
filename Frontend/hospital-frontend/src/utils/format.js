/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '—';
  const d = new Date(date);
  if (format === 'short') {
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  }
  if (format === 'long') {
    return d.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (format === 'datetime') {
    return d.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  return d.toString();
};

/**
 * Format time to readable string
 */
export const formatTime = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

/**
 * Get status badge color based on appointment status
 */
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'PENDING':
      return 'warning';
    case 'CONFIRMED':
      return 'primary';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'danger';
    default:
      return 'secondary';
  }
};

/**
 * Get status icon based on appointment status
 */
export const getStatusIcon = (status) => {
  switch (status) {
    case 'PENDING':
      return 'hourglass-split';
    case 'CONFIRMED':
      return 'calendar-check';
    case 'COMPLETED':
      return 'check2-circle';
    case 'CANCELLED':
      return 'x-circle';
    default:
      return 'question-circle';
  }
};

/**
 * Get role badge color
 */
export const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'danger';
    case 'DOCTOR':
      return 'success';
    case 'PATIENT':
      return 'primary';
    default:
      return 'secondary';
  }
};

/**
 * Check if appointment is in the past
 */
export const isAppointmentInPast = (appointmentDate) => {
  if (!appointmentDate) return false;
  return new Date(appointmentDate) < new Date();
};

/**
 * Check if appointment is today
 */
export const isAppointmentToday = (appointmentDate) => {
  if (!appointmentDate) return false;
  const apptDate = new Date(appointmentDate).toDateString();
  const today = new Date().toDateString();
  return apptDate === today;
};

/**
 * Check if appointment is within the next 24 hours
 */
export const isAppointmentSoon = (appointmentDate) => {
  if (!appointmentDate) return false;
  const now = new Date();
  const apptTime = new Date(appointmentDate);
  const diffMinutes = (apptTime - now) / (1000 * 60);
  return diffMinutes > 0 && diffMinutes <= 1440; // 24 hours
};

/**
 * Calculate queue position info
 */
export const getQueueInfo = (position) => {
  if (!position || position <= 0) return 'No queue info';
  if (position === 1) return 'You are next!';
  if (position <= 3) return `${position} patients ahead of you`;
  return `Position #${position} in queue`;
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (10 digits)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone?.replace(/\D/g, '') || '');
};
