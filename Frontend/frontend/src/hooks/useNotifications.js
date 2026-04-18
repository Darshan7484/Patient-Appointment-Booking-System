// Notification Utility Functions
// Easy-to-use wrappers for common notification scenarios

import { useNotification } from '../context/NotificationContext';

export const useNotifications = () => {
  const { addNotification, removeNotification, clearAllNotifications, soundEnabled, setSoundEnabled } = useNotification();

  return {
    // Simple notification types
    success: (message, duration = 4000) =>
      addNotification(message, 'success', duration, { sound: true }),
    
    error: (message, duration = 5000) =>
      addNotification(message, 'error', duration, { sound: true }),
    
    warning: (message, duration = 4500) =>
      addNotification(message, 'warning', duration, { sound: true }),
    
    info: (message, duration = 3500) =>
      addNotification(message, 'info', duration, { sound: false }),
    
    loading: (message) =>
      addNotification(message, 'loading', 0, { sound: false }), // No auto-close
    
    // With custom options
    notify: (message, type = 'info', duration = 4000, options = {}) =>
      addNotification(message, type, duration, options),
    
    // Action feedback
    success_action: (action) =>
      addNotification(`${action} completed successfully!`, 'success', 3000),
    
    error_action: (action, reason = '') =>
      addNotification(`${action} failed. ${reason}`, 'error', 5000),
    
    delete_confirm: (item) =>
      addNotification(`${item} deleted successfully!`, 'warning', 3500),
    
    create_success: (item) =>
      addNotification(`${item} created successfully!`, 'success', 3500),
    
    update_success: (item) =>
      addNotification(`${item} updated successfully!`, 'success', 3500),
    
    // Async operation handlers
    withLoading: async (promise, messages = {}) => {
      const {
        loading = 'Loading...',
        success = 'Done!',
        error = 'Something went wrong'
      } = messages;

      const notifId = addNotification(loading, 'loading', 0);
      try {
        const result = await promise;
        removeNotification(notifId);
        addNotification(success, 'success', 3000);
        return result;
      } catch (err) {
        removeNotification(notifId);
        addNotification(error, 'error', 5000);
        throw err;
      }
    },
    
    // Utility functions
    remove: removeNotification,
    clearAll: clearAllNotifications,
    isSoundEnabled: soundEnabled,
    toggleSound: () => setSoundEnabled(!soundEnabled)
  };
};

export default useNotifications;
