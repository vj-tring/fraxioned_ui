import axios from 'axios';
import { PortURL } from '../config';

interface SendInvitePayload {
  email: string;
  roleId: number | '';
  invitedBy: string;
}

export const sendInvite = async (payload: SendInvitePayload) => {
  try {
    const response = await axios.post(`${PortURL}/authentication/invite`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
