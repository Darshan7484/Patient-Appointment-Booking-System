import React from 'react';
import { useNotification } from '../context/NotificationContext';
import Toast from './Toast';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`toast show mb-2 ${notif.type === 'success' ? 'bg-success' : notif.type === 'error' ? 'bg-danger' : notif.type === 'warning' ? 'bg-warning' : 'bg-info'} text-white`}
          role="alert"
          style={{ minWidth: 300 }}
        >
          <div className="toast-body d-flex align-items-center">
            <div className="flex-grow-1">{notif.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => removeNotification(notif.id)}
              aria-label="Close"
            ></button>
          </div>
        </div>
      ))}
    </div>
  );
}
