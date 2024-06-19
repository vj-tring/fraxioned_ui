// src/api/contactApi.ts
import axios from 'axios';
import { ApiUrl } from "../Components/config";
import { ContactMessagePayload } from '../../src/Components/Types/contact';

export const sendContactMessage = async (payload: ContactMessagePayload) => {
  try {
    const response = await axios.post(`${ApiUrl}/contact-us`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
