import axios from 'axios';
import { ApiUrl } from '../Components/config';
import { SendInvitePayload } from '../Components/Types/Send-invite';


export const sendInvite = async (payload: SendInvitePayload) => {
  try {
    const response = await axios.post(`${ApiUrl}/authentication/invite`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
