// Enhanced Notification System
// Provides improved user feedback with animations, sound, and persistence

import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play notification sound
  const playSound = useCallback((type = 'success') => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different notification types
      const frequencies = {
        success: 800,
        error: 300,
        warning: 600,
        info: 500,
        loading: 400
      };
      
      oscillator.frequency.value = frequencies[type] || 500;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (err) {
      // Silently fail if audio API not available
      console.debug('Audio notification unavailable');
    }
  }, [soundEnabled]);

  const addNotification = useCallback((message, type = 'success', autoClose = 4000, options = {}) => {
    const id = `notif-${Date.now()}-${Math.random()}`;
    const notification = {
      id,
      message,
      type,
      autoClose,
      timestamp: new Date(),
      progress: 100,
      ...options
    };

    // Add to active notifications
    setNotifications(prev => [...prev, notification]);

    // Add to history
    setHistory(prev => [{...notification, closedAt: null}, ...prev].slice(0, 50));

    // Play sound
    if (options.sound !== false) {
      playSound(type);
    }

    // Auto-close timer with progress tracking
    if (autoClose) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, autoClose - elapsed);
        const progress = (remaining / autoClose) * 100;

        setNotifications(prev =>
          prev.map(n =>
            n.id === id ? { ...n, progress } : n
          )
        );

        if (remaining <= 0) {
          clearInterval(interval);
          removeNotification(id);
        }
      }, 50);

      return () => clearInterval(interval);
    }

    return id;
  }, [soundEnabled, playSound]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification) {
        setHistory(prev =>
          prev.map(n =>
            n.id === id ? { ...n, closedAt: new Date() } : n
          )
        );
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const value = {
    notifications,
    history,
    soundEnabled,
    setSoundEnabled,
    addNotification,
    removeNotification,
    clearAllNotifications,
    clearHistory
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
