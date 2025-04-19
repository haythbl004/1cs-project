// src/config.js
const config = {
    apiUrl: window.REACT_APP_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000',
    authCookieName: 'uniAuthToken',
    cookieExpiryDays: 7,
    // Add other configs as needed
  };
  
  export default config;