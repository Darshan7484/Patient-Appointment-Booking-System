import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', autoClose = 4000 }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => setShow(false), autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose]);

  if (!show) return null;

  const bgColor = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info'
  }[type];

  const icon = {
    success: 'bi-check-circle',
    error: 'bi-exclamation-circle',
    warning: 'bi-exclamation-triangle',
    info: 'bi-info-circle'
  }[type];

  return (
    <div className={`toast show position-fixed bottom-0 end-0 m-3 ${bgColor} text-white`} role="alert" style={{ minWidth: 300 }}>
      <div className="toast-body d-flex align-items-center gap-2">
        <i className={`bi ${icon}`}></i>
        <div>{message}</div>
        <button
          type="button"
          className="btn-close btn-close-white ms-auto"
          onClick={() => setShow(false)}
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
}
