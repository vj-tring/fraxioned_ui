import axios from 'axios';
import { ApiUrl } from '../Components/config';
import { ForgotPasswordPayload } from '../../src/Components/Types/Forgot';


export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  try {
    const response = await axios.post(`${ApiUrl}/authentication/forgot-password`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
