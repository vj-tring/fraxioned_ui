export const 


isAuthenticated = () => {
  const userData = localStorage.getItem('userData');
  const token = localStorage.getItem('token');
  const expiresAt = localStorage.getItem('expiresAt');

  // Check if the user data, token, and expiration date exist and are valid
  return userData && token && expiresAt && new Date(expiresAt) > new Date();
};
