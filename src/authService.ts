/* eslint-disable @typescript-eslint/no-unused-vars */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('accessToken')
  const session = localStorage.getItem('session')

  if (token && session) {
    try {
      const { expiresAt } = JSON.parse(session)
      return true
    } catch (error) {
      console.error('Failed to parse session data:', error)
      return false
    }
  }

  return false
}
