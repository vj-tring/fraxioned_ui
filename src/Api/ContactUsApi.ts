// src/api/contactApi.ts
import axios from 'axios';
import { PortURL } from "../Components/config";
import { ContactMessagePayload } from '../../src/Components/Types/contact';

export const sendContactMessage = async (payload: ContactMessagePayload) => {
  try {
    const response = await axios.post(`${PortURL}/contact-us`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};
