import axios from 'axios';
import { PortURL } from "../Components/config";
export const logout = async () => {
  try {
    const response = await axios.post(`${PortURL}/authentication/logout`);
    return response;
  } catch (error) {
    throw error;
  }
};
