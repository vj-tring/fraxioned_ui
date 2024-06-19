import axios from 'axios';
import { forgotPassword } from './ForgotApi';
import { ApiUrl } from '../Components/config';

jest.mock('axios');
axios.post = jest.fn();

describe('forgotPassword', () => {
  it('should call axios.post with the correct URL and payload', async () => {
    const payload = { email: 'test@example.com' };
    const response = { data: 'response data' };

    (axios.post as jest.Mock).mockResolvedValue(response);

    const result = await forgotPassword(payload);

    expect(axios.post).toHaveBeenCalledWith(`${ApiUrl}/authentication/forgot-password`, payload);
    expect(result).toEqual(response);
  });

  it('should throw an error if axios.post fails', async () => {
    const payload = { email: 'test@example.com' };
    const errorMessage = 'Network Error';

    (axios.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(forgotPassword(payload)).rejects.toThrow(errorMessage);
  });
});