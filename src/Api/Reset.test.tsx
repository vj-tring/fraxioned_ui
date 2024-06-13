// resetPassword.api.test.js
import axios from 'axios';
import { resetPassword } from './ResetApi';
import { PortURL } from "../Components/config";
import { ResetPasswordPayload } from '../Components/Types/Reset';

jest.mock('axios');

describe('resetPassword API', () => {
  it('calls the correct endpoint with the correct payload', async () => {
    const payload: ResetPasswordPayload = {
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    };

    const response = {
      data: {
        message: 'Password reset successfully',
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(response);

    await resetPassword(payload);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(`${PortURL}/authentication/reset-password`, payload);
  });

  it('returns the response from the API', async () => {
    const payload: ResetPasswordPayload = {
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    };

    const response = {
      data: {
        message: 'Password reset successfully',
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(response);

    const result = await resetPassword(payload);

    expect(result).toEqual(response);
  });

  it('throws an error if the API call fails', async () => {
    const payload: ResetPasswordPayload = {
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    };

    const error = new Error('API call failed');

    (axios.post as jest.Mock).mockRejectedValue(error);

    await expect(resetPassword(payload)).rejects.toThrowError(error);
  });
});