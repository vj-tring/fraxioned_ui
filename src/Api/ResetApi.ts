import axios from 'axios';
import { PortURL } from '../Components/config';
import { ResetPasswordPayload } from '../Components/Types/Reset';

export const resetPassword = async (payload: ResetPasswordPayload, token: string) => {
  try {
    const response = await axios.post(
      `${PortURL}/authentication/reset-password`,
      payload,
      {
        headers: {
          resetToken: `${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
