export const isAuthenticated = () => {
  const userData = localStorage.getItem('userData')
  const token = localStorage.getItem('token')
  const expiredAt = localStorage.getItem('expiredAt')

  // Check if the user data, token, and expiration date exist and are valid
  return userData && token && expiredAt && new Date(expiredAt) > new Date()
}
