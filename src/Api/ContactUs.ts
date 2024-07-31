// src/api/contactApi.ts
import axios from 'axios'
import { ApiUrl } from '../Components/config'
import { ContactMessage } from '../Components/Types/contact'

export const sendContactMessage = async (payload: ContactMessage) => {
  try {
    const response = await axios.post(`${ApiUrl}/contact-us`, payload)
    return response.data
  } catch (error) {
    throw error
  }
}
