import axios from 'axios';
import { PortURL } from '../config';

export const sendContactMessage = async (name: string, subject: string, message: string, invitedBy: string) => {
  try {
    const response = await axios.post(`${PortURL}/contact-us`, {
      name,
      subject,
      message,
      invitedBy
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
