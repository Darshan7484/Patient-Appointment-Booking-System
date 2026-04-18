import React, { useEffect, useState, memo } from 'react';

const iconMap = {
  success: 'bi-check-circle-fill',
  error: 'bi-exclamation-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
  danger: 'bi-exclamation-circle-fill'
};

const colorMap = {
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  danger: '#dc3545'
};

// Memoized Toast: Each notification toast is a separate component
// Memoization prevents other toasts from re-rendering when one updates
const Toast = memo(function Toast({ message, type = 'success', autoClose = 4000 }) {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (autoClose) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, autoClose - elapsed);
        setProgress((remaining / autoClose) * 100);

        if (remaining <= 0) {
          clearInterval(interval);
          setShow(false);
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [autoClose]);

  if (!show) return null;

  const bgColor = {
    success: 'bg-success',
    error: 'bg-danger',
    warning: 'bg-warning',
    info: 'bg-info',
    danger: 'bg-danger'
  }[type];

  return (
    <div
      className={`toast show position-fixed bottom-0 end-0 m-3 bg-white shadow-lg border-0`}
      role="alert"
      style={{
        minWidth: 340,
        borderLeft: `4px solid ${colorMap[type]}`,
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div className="toast-body p-3">
        <div className="d-flex align-items-flex-start gap-2">
          {/* Icon */}
          <i
            className={`bi ${iconMap[type]} fs-5`}
            style={{ color: colorMap[type], minWidth: '1.5rem', marginTop: '2px' }}
          ></i>

          {/* Message */}
          <div className="flex-grow-1">
            <div className="small fw-semibold" style={{ color: colorMap[type] }}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </div>
            <div className="text-dark mt-1">{message}</div>

            {/* Progress Bar */}
            {autoClose && (
              <div className="mt-2" style={{ height: '3px', background: '#e9ecef', borderRadius: '2px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    background: colorMap[type],
                    width: `${progress}%`,
                    transition: 'width 0.05s linear'
                  }}
                />
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            type="button"
            className="btn-close"
            onClick={() => setShow(false)}
            aria-label="Close"
            style={{ marginTop: '-2px' }}
          ></button>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .toast {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .toast:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          transition: box-shadow 0.2s ease;
        }
      `}</style>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: Only re-render if message or type changes
  return prevProps.message === nextProps.message &&
         prevProps.type === nextProps.type &&
         prevProps.autoClose === nextProps.autoClose;
});

export default Toast;
