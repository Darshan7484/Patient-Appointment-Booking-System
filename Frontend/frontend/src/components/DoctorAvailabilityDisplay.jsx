import React, { memo } from 'react';

// Memoized component: Prevents re-renders when parent updates but props don't change
// This is especially important for list items rendered repeatedly
const DoctorAvailabilityDisplay = memo(function DoctorAvailabilityDisplay({ doctor }) {
  if (!doctor) return null;

  const availableTime = doctor.availableTime || doctor.availableSlots || 'Not specified';
  
  // Parse available time if it's in a specific format
  let displayTime = availableTime;
  
  // Common formats: "9:00 AM - 5:00 PM", "09:00-17:00", etc.
  if (typeof availableTime === 'string') {
    displayTime = availableTime;
  }

  return (
    <div className="alert alert-info d-flex align-items-center gap-3 mb-0">
      <i className="bi bi-calendar-check-fill fs-4"></i>
      <div>
        <div className="fw-semibold">Available at:</div>
        <div className="small text-muted">{displayTime}</div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: Only re-render if doctor object changes
  return prevProps.doctor?.id === nextProps.doctor?.id && 
         prevProps.doctor?.availableTime === nextProps.doctor?.availableTime;
});

export default DoctorAvailabilityDisplay;
