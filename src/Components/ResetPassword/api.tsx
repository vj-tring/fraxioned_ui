import axios from 'axios';
import { PortURL } from '../config';

interface ResetPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

export const resetPassword = async (payload: ResetPasswordPayload) => {
  try {
    const response = await axios.post(`${PortURL}/authentication/reset-password`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
