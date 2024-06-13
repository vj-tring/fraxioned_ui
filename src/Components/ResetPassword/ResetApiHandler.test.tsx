import { renderHook, act } from '@testing-library/react-hooks';
import axios, { AxiosResponse, AxiosError } from 'axios';
import useResetHandler from './ResetApiHandler';
import { resetPassword } from '../../Api/ResetApi'; // Adjust import path based on your actual file structure
import { ResetPasswordPayload } from '../Types/Reset'; // Adjust import path based on your actual file structure
jest.mock('axios');
jest.mock('../../Api/ResetApi');

describe('useResetHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles successful password reset', async () => {
    const mockPayload: ResetPasswordPayload = { newPassword: 'newPassword', confirmPassword: 'newPassword' };
    // const mockSuccessResponse: AxiosResponse = { data: { message: 'Password reset successfully!' }, status: 200, statusText: 'OK', headers: {}, config: {} };

    // Mock resetPassword API call
    // (resetPassword as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useResetHandler());

    // Execute form submission
    await act(async () => {
      await result.current.formik.handleSubmit();
    });

    // Assertions
    expect(resetPassword).toHaveBeenCalledWith(mockPayload);
    expect(result.current.openSnackbar).toBe(true);
    expect(result.current.snackbarMessage).toBe('Password reset successfully!');
    expect(result.current.snackbarSeverity).toBe('success');

    // Wait for state update
    await waitForNextUpdate();

    // Additional assertions if navigation or other side effects occur
    // e.g., expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('handles error in password reset', async () => {
    const mockError: AxiosError = new Error('Failed to reset password') as AxiosError;
    const mockPayload: ResetPasswordPayload = { newPassword: 'newPassword', confirmPassword: 'newPassword' };

    // Mock resetPassword API call
    (resetPassword as jest.Mock).mockRejectedValueOnce(mockError);

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useResetHandler());

    // Execute form submission
    await act(async () => {
      await result.current.formik.handleSubmit();
    });

    // Assertions
    expect(resetPassword).toHaveBeenCalledWith(mockPayload);
    expect(result.current.openSnackbar).toBe(true);
    expect(result.current.snackbarMessage).toBe('Error resetting password!');
    expect(result.current.snackbarSeverity).toBe('error');

    // Wait for state update
    await waitForNextUpdate();
  });

  test('handles unknown error in password reset', async () => {
    const mockError: AxiosError = new Error('Network Error') as AxiosError;
    const mockPayload: ResetPasswordPayload = { newPassword: 'newPassword', confirmPassword: 'newPassword' };

    // Mock resetPassword API call
    (resetPassword as jest.Mock).mockRejectedValueOnce(mockError);

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useResetHandler());

    // Execute form submission
    await act(async () => {
      await result.current.formik.handleSubmit();
    });

    // Assertions
    expect(resetPassword).toHaveBeenCalledWith(mockPayload);
    expect(result.current.openSnackbar).toBe(true);
    expect(result.current.snackbarMessage).toBe('An unknown error occurred');
    expect(result.current.snackbarSeverity).toBe('error');

    // Wait for state update
    await waitForNextUpdate();
  });
});
