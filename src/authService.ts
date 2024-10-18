export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken')
  const session : any = JSON.stringify(localStorage.getItem('session'))

  return token && session
}
