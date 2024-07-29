import axios from 'axios'
import { ApiUrl } from '../config/config'
import { Login } from '../model/Login'

export const login = async (payload: Login) => {
  try {
    const response = await axios.post(`${ApiUrl}/authentication/login`, payload)
    return response
  } catch (error) {
    throw error
  }
}
