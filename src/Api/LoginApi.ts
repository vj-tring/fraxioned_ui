import axios from 'axios';
import { PortURL } from '../Components/config';
import { LoginPayload } from '../Components/Types/Login';

export const login = async (payload: LoginPayload) => {
  try {
    const response = await axios.post(`${PortURL}/authentication/login`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
