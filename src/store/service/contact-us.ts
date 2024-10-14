// src/api/contactApi.ts
import axios from 'axios'
import { ContactMessage } from '../../types/contact'
import { BACKEND_URL } from './config'

export const sendContactMessage = async (payload: ContactMessage) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/contact-us`, payload)
    return response.data
  } catch (error) {
    throw error
  }
}
