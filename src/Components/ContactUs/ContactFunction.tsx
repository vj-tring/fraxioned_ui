import { sendContactMessage } from '../../Api/ContactUs'
import { ContactMessage } from '../Types/contact'

export const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
  name: string,
  email: string,
  subject: string,
  message: string,
  setSnackbarMessage: (message: string) => void,
  setOpenSnackbar: (isOpen: boolean) => void,
  setName: (name: string) => void,
  setEmail: (email: string) => void,
  setSubject: (subject: string) => void,
  setMessage: (message: string) => void
) => {
  event.preventDefault()
  try {
    const userString = localStorage.getItem('userData')
    if (userString) {
      const userObject = JSON.parse(userString)
      const userId = userObject.id
      console.log('userId', userId)
      const payload: ContactMessage = {
        userId,
        name,
        email,
        message,
        subject,
      }
      await sendContactMessage(payload)

      setSnackbarMessage('Message sent successfully!')
      setOpenSnackbar(true)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    }
  } catch (error) {
    console.error(error)
    setSnackbarMessage('Error sending message. Please try again.')
    setOpenSnackbar(true)
  }
}