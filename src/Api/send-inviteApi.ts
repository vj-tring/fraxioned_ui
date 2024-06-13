import axios from 'axios';
import { PortURL } from '../Components/config';
import { SendInvitePayload } from '../Components/Types/Send-invite';


export const sendInvite = async (payload: SendInvitePayload) => {
  try {
    const response = await axios.post(`${PortURL}/authentication/invite`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
