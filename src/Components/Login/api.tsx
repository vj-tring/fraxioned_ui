import axios from 'axios';
import { PortURL } from '../config';

interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (payload: LoginPayload) => {
  try {
    const response = await axios.post(`${PortURL}/authentication/login`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
