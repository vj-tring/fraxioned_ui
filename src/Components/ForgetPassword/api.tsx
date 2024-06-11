import axios from 'axios';
import { PortURL } from '../config';

interface ForgotPasswordPayload {
  email: string;
}

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  try {
    const response = await axios.post(`${PortURL}/authentication/forgot-password`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
