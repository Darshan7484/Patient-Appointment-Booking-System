import React from 'react';
import { useNotification } from '../context/NotificationContext';

const iconMap = {
  success: 'bi-check-circle-fill',
  error: 'bi-exclamation-circle-fill',
  warning: 'bi-exclamation-triangle-fill',
  info: 'bi-info-circle-fill',
  loading: 'bi-hourglass-split'
};

const colorMap = {
  success: '#28a745',
  error: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  loading: '#007bff'
};

const textColorMap = {
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-info',
  loading: 'text-primary'
};

export default function NotificationContainer() {
  const { notifications, removeNotification, soundEnabled, setSoundEnabled } = useNotification();

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <>
      {/* Notification Toast List */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="toast show mb-2 bg-white shadow-lg border-0"
            role="alert"
            style={{
              minWidth: 340,
              animation: 'slideInRight 0.3s ease-out',
              borderLeft: `4px solid ${colorMap[notif.type] || '#007bff'}`
            }}
          >
            <div className="toast-body p-3">
              <div className="d-flex align-items-flex-start gap-2">
                {/* Icon */}
                <i
                  className={`bi ${iconMap[notif.type]} fs-5`}
                  style={{ color: colorMap[notif.type], minWidth: '1.5rem', marginTop: '2px' }}
                ></i>

                {/* Message */}
                <div className="flex-grow-1">
                  <div className="small fw-semibold" style={{ color: colorMap[notif.type] }}>
                    {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                  </div>
                  <div className="text-dark mt-1">{notif.message}</div>

                  {/* Progress Bar */}
                  {notif.autoClose && (
                    <div className="mt-2" style={{ height: '3px', background: '#e9ecef', borderRadius: '2px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          background: colorMap[notif.type],
                          width: `${notif.progress}%`,
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
                  onClick={() => removeNotification(notif.id)}
                  aria-label="Close"
                  style={{ marginTop: '-2px' }}
                ></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sound Toggle Button */}
      {notifications.length > 0 && (
        <button
          onClick={handleSoundToggle}
          className={`position-fixed bottom-0 start-0 p-3 btn btn-sm ${soundEnabled ? 'btn-primary' : 'btn-secondary'}`}
          title={soundEnabled ? 'Sound ON' : 'Sound OFF'}
          style={{ zIndex: 1050 }}
        >
          <i className={`bi ${soundEnabled ? 'bi-volume-up-fill' : 'bi-volume-mute-fill'}`}></i>
        </button>
      )}

      {/* Global Animations */}
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

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        .toast.hide {
          animation: slideOutRight 0.3s ease-in;
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
    </>
  );
}

