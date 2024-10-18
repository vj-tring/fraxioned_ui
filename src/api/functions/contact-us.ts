// src/api/contactApi.ts
import axios from 'axios'
import { ContactMessage } from '../../store/model/contact-message'

export const sendContactMessage = async (payload: ContactMessage) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/contact-us`, payload)
    return response.data
  } catch (error) {
    throw error
  }
}
