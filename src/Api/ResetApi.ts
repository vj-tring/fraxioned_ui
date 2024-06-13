import axios from 'axios';
import { PortURL } from "../Components/config";
import { ResetPasswordPayload } from '../Components/Types/Reset';
export const resetPassword = async (payload: ResetPasswordPayload) => {
  try {
    const response = await axios.post(`${PortURL}/authentication/reset-password`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
