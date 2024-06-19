import axios from 'axios';
import { ApiUrl } from '../Components/config';
import { LoginPayload } from '../Components/Types/Login';

export const login = async (payload: LoginPayload) => {
  try {
    const response = await axios.post(`${ApiUrl}/authentication/login`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
