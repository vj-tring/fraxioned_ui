import axios from 'axios'
import { ApiUrl } from '../Components/config'
import { Login } from '../Components/Types/Login'

export const login = async (payload: Login) => {
  try {
    const response = await axios.post(`${ApiUrl}/authentication/login`, payload)
    return response
  } catch (error) {
    throw error
  }
}
