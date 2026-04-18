import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ========== SERVICE WORKER REGISTRATION (Phase 2 Performance) ==========
// Enables offline support, request/response caching, and background sync
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceWorker.js')
      .then(reg => {
        console.log('✅ Service Worker registered successfully');
        console.log('📍 Scope:', reg.scope);
        
        // Check for updates every minute
        setInterval(() => {
          reg.update();
        }, 60000);
      })
      .catch(err => {
        console.warn('⚠️ Service Worker registration failed:', err);
      });
  });

  // Handle service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('🔄 New Service Worker activated');
    // Optional: Show user notification about app update
  });
} else {
  console.info('ℹ️ Service Workers not supported in this browser');
}

// ========== PERFORMANCE MONITORING ==========
// Log Core Web Vitals for performance tracking
if (window.performance && window.performance.timing) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`📊 Page Load Time: ${pageLoadTime}ms`);
      
      // Log specific metrics
      const connectTime = perfData.responseEnd - perfData.fetchStart;
      const renderTime = perfData.domComplete - perfData.domLoading;
      console.log(`   - Network: ${connectTime}ms | DOM Render: ${renderTime}ms`);
    }, 0);
  });
}
