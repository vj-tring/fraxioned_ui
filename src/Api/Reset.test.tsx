import axios from 'axios';
import { resetPassword } from './Reset';
import { ApiUrl } from '../Components/config';
import '@testing-library/jest-dom';
import { ResetPassword } from '../Components/Types/Reset';

jest.mock('axios');

describe('resetPassword API', () => {
  const token = 'test-token';

  it('calls the correct endpoint with the correct payload', async () => {
    const payload: ResetPassword = {
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    };

    const response = {
      data: {
        message: 'Password reset successfully',
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(response);

    await resetPassword(payload, token);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${ApiUrl}/authentication/reset-password`,
      payload,
      {
        headers: {
          resetToken: token,
        },
      }
    );
  });

  it('returns the response from the API', async () => {
    const payload: ResetPassword= {
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    };

    const response = {
      data: {
        message: 'Password reset successfully',
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(response);

    const result = await resetPassword(payload, token);

    expect(result).toEqual(response);
  });

  it('throws an error if the API call fails', async () => {
    const payload: ResetPassword = {
      newPassword: 'newpassword',
      confirmPassword: 'newpassword',
    };

    const error = new Error('API call failed');

    (axios.post as jest.Mock).mockRejectedValue(error);

    await expect(resetPassword(payload, token)).rejects.toThrowError(error);
  });
});
