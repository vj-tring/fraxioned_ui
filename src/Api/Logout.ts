import axios from 'axios'
import { ApiUrl } from '../Components/config'
export const logout = async () => {
  try {
    const response = await axios.post(`${ApiUrl}/authentication/logout`)
    return response
  } catch (error) {
    throw error
  }
}