import axios from 'axios';
import { PortURL } from '../../Components/config';

export const registerUser = async (payload: any) => {
  try {
    const response = await axios.post(`${PortURL}/authentication/register`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
