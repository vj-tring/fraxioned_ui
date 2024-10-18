export const isAuthenticated = () => {
  // const userData = localStorage.getItem('user')
  const token = localStorage.getItem('accessToken')
  const session : any = JSON.stringify(localStorage.getItem('session'))
  // console.log(userData)
  // console.log(token)
  // console.log(expiredAt)
  // Check if the user data, token, and expiration date exist and are valid
  return token && session
}
