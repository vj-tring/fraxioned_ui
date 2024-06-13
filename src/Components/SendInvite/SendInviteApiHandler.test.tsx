// SendInviteApiHandler.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import axios, { AxiosResponse, AxiosError } from 'axios';
import useSendInviteHandler from './SendInviteApiHandler';
import { sendInvite } from '../../Api/send-inviteApi';
import { SendInvitePayload } from '../Types/Send-invite';
jest.mock('axios');
jest.mock('../../Api/send-inviteApi');

describe('useSendInviteHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles successful invite', async () => {
    const mockLocalStorageData = { id: 123 }; // Mocked user data
    const mockPayload = { email: 'test@example.com', roleId: 1, invitedBy: mockLocalStorageData.id };
    // const mockSuccessResponse: AxiosResponse = { data: { status: 'success' }, status: 200, statusText: 'OK', headers: {}, config: {} };

    // Mock localStorage getItem
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce(JSON.stringify(mockLocalStorageData));

    // Mock sendInvite API call
    // (sendInvite as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

    // Render the hook
    const { result } = renderHook(() => useSendInviteHandler());

    // Execute handleSubmit
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>);
    });

    // Assertions
    expect(sendInvite).toHaveBeenCalledWith(mockPayload);
    expect(result.current.status).toBe('success');
    expect(result.current.errorMessage).toBe('');
  });

  test('handles error in invite', async () => {
    const mockError: AxiosError = new Error('Failed to send invite') as AxiosError;
    // mockError.response = { data: { message: 'Failed to send the invite. Please try again later.' }, status: 500, statusText: 'Internal Server Error', headers: {}, config: {} };
    const mockLocalStorageData = { id: 123 }; // Mocked user data
    const mockPayload = { email: 'test@example.com', roleId: 1, invitedBy: mockLocalStorageData.id };

    // Mock localStorage getItem
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce(JSON.stringify(mockLocalStorageData));

    // Mock sendInvite API call
    (sendInvite as jest.Mock).mockRejectedValueOnce(mockError);

    // Render the hook
    const { result } = renderHook(() => useSendInviteHandler());

    // Execute handleSubmit
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>);
    });

    // Assertions
    expect(sendInvite).toHaveBeenCalledWith(mockPayload);
    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe('Failed to send the invite. Please try again later.');
  });

  test('handles unknown error in invite', async () => {
    const mockError: AxiosError = new Error('Network Error') as AxiosError;
    const mockLocalStorageData = { id: 123 }; // Mocked user data
    const mockPayload = { email: 'test@example.com', roleId: 1, invitedBy: mockLocalStorageData.id };

    // Mock localStorage getItem
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValueOnce(JSON.stringify(mockLocalStorageData));

    // Mock sendInvite API call
    (sendInvite as jest.Mock).mockRejectedValueOnce(mockError);

    // Render the hook
    const { result } = renderHook(() => useSendInviteHandler());

    // Execute handleSubmit
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() } as unknown as React.FormEvent<HTMLFormElement>);
    });

    // Assertions
    expect(sendInvite).toHaveBeenCalledWith(mockPayload);
    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe('An unknown error occurred');
  });
});
