import axios from 'axios'
import { ApiUrl } from '../Components/config'
import { ForgotPassword } from 'Components/Types/Forgot'

export const forgotPassword = async (payload: ForgotPassword) => {
  try {
    const response = await axios.post(
      `${ApiUrl}/authentication/forgot-password`,
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
