// sendInvite.api.test.js
import axios from 'axios';
import { sendInvite } from './send-inviteApi';
import { PortURL } from '../Components/config';
import { SendInvitePayload } from '../Components/Types/Send-invite';

jest.mock('axios');

describe('sendInvite API', () => {
  it('calls the correct endpoint with the correct payload', async () => {
    const payload: SendInvitePayload = {
      email: 'email@example.com',
      roleId:1,
      invitedBy:""
    };

    const response = {
      data: {
        message: 'Invite sent successfully',
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(response);

    await sendInvite(payload);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(`${PortURL}/authentication/invite`, payload);
  });

  it('returns the response from the API', async () => {
    const payload: SendInvitePayload = {
      email: 'email@example.com',
      roleId:1,
      invitedBy:""    };

    const response = {
      data: {
        message: 'Invite sent successfully',
      },
    };

    (axios.post as jest.Mock).mockResolvedValue(response);

    const result = await sendInvite(payload);

    expect(result).toEqual(response);
  });

  it('throws an error if the API call fails', async () => {
    const payload: SendInvitePayload = {
      email: 'email@example.com',
      roleId:1,
      invitedBy:""    };

    const error = new Error('API call failed');

    (axios.post as jest.Mock).mockRejectedValue(error);

    await expect(sendInvite(payload)).rejects.toThrowError(error);
  });
});