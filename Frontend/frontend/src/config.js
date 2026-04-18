// ====== API Configuration ======
// Automatically detect the correct API URL based on environment

let API_URL;

if (process.env.NODE_ENV === 'production') {
  // In production, use the environment variable or the current domain
  API_URL = process.env.REACT_APP_API_URL || window.location.origin;
} else {
  // In development
  if (process.env.REACT_APP_API_URL) {
    // Use custom API URL from environment variable
    API_URL = process.env.REACT_APP_API_URL;
  } else {
    // Try to detect from window location for mobile/network access
    const hostname = window.location.hostname;
    const port = 8080;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Local development - use localhost
      API_URL = `http://localhost:${port}`;
    } else {
      // Mobile or network access - use the current hostname (your computer's IP)
      API_URL = `http://${hostname}:${port}`;
    }
  }
}

export const getApiUrl = () => API_URL;
export const setApiUrl = (url) => {
  API_URL = url;
};

export default API_URL;
