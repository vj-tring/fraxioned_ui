export const isAuthenticated = () => {
  const userData = localStorage.getItem('userData')
  const token = localStorage.getItem('token')
  const expiredAt = localStorage.getItem('expiredAt')
  console.log(userData)
  console.log(token)
  console.log(expiredAt)
  // Check if the user data, token, and expiration date exist and are valid
  return userData && token && expiredAt
}
