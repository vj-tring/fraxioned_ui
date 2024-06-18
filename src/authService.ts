// authService.js

export const isAuthenticated = () => {
    const userData = localStorage.getItem('userData');
    const token = localStorage.getItem('token');
    const expiresAt = localStorage.getItem('expiresAt');
  
    // Additional checks if necessary
    return userData && token && expiresAt && new Date(expiresAt) > new Date();
  };
  