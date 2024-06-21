import axios from 'axios';
import { ApiUrl } from "../Components/config";

export const registerUser = async (payload: any) => {
  try {
    const response = await axios.post(`${ApiUrl}/authentication/register`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
