import { renderHook, act } from '@testing-library/react';
// import axios, { AxiosResponse, AxiosError } from 'axios';
import useResetHandler from './ResetApiHandler';
import { useNavigate } from 'react-router-dom';
// import { resetPassword } from '../../Api/ResetApi'; 
// import { ResetPasswordPayload } from '../Types/Reset'; 
jest.mock('axios');
jest.mock('../../Api/ResetApi');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;

describe('useResetHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseNavigate.mockReturnValue(jest.fn());
  });

  // test('handles successful password reset', async () => {
  //   const mockPayload: ResetPasswordPayload = { newPassword: 'newPassword', confirmPassword: 'newPassword' };
  //   // const mockSuccessResponse: AxiosResponse = { data: { message: 'Password reset successfully!' }, status: 200, statusText: 'OK', headers: {}, config: {} };

  //   // Mock resetPassword API call
  //   // (resetPassword as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

  //   // Render the hook
  //   const { result, waitForNextUpdate } = renderHook(() => useResetHandler());

  //   // Execute form submission
  //   await act(async () => {
  //     await result.current.formik.handleSubmit();
  //   });

  //   // Assertions
  //   expect(resetPassword).toHaveBeenCalledWith(mockPayload);
  //   expect(result.current.openSnackbar).toBe(true);
  //   expect(result.current.snackbarMessage).toBe('Password reset successfully!');
  //   expect(result.current.snackbarSeverity).toBe('success');

  //   // Wait for state update
  //   await waitForNextUpdate();

  //   // Additional assertions if navigation or other side effects occur
  //   // e.g., expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  // });

  // test('handles error in password reset', async () => {
  //   const mockError: AxiosError = new Error('Failed to reset password') as AxiosError;
  //   const mockPayload: ResetPasswordPayload = { newPassword: 'newPassword', confirmPassword: 'newPassword' };

  //   // Mock resetPassword API call
  //   (resetPassword as jest.Mock).mockRejectedValueOnce(mockError);

  //   // Render the hook
  //   const { result, waitForNextUpdate } = renderHook(() => useResetHandler());

  //   // Execute form submission
  //   await act(async () => {
  //     await result.current.formik.handleSubmit();
  //   });

  //   // Assertions
  //   expect(resetPassword).toHaveBeenCalledWith(mockPayload);
  //   expect(result.current.openSnackbar).toBe(true);
  //   expect(result.current.snackbarMessage).toBe('Error resetting password!');
  //   expect(result.current.snackbarSeverity).toBe('error');

  //   // Wait for state update
  //   await waitForNextUpdate();
  // });

  // test('handles unknown error in password reset', async () => {
  //   const mockError: AxiosError = new Error('Network Error') as AxiosError;
  //   const mockPayload: ResetPasswordPayload = { newPassword: 'newPassword', confirmPassword: 'newPassword' };

  //   // Mock resetPassword API call
  //   (resetPassword as jest.Mock).mockRejectedValueOnce(mockError);

  //   // Render the hook
  //   const { result, waitForNextUpdate } = renderHook(() => useResetHandler());

  //   // Execute form submission
  //   await act(async () => {
  //     await result.current.formik.handleSubmit();
  //   });

  //   // Assertions
  //   expect(resetPassword).toHaveBeenCalledWith(mockPayload);
  //   expect(result.current.openSnackbar).toBe(true);
  //   expect(result.current.snackbarMessage).toBe('An unknown error occurred');
  //   expect(result.current.snackbarSeverity).toBe('error');

  //   // Wait for state update
  //   await waitForNextUpdate();
  // });
  test('handles Snackbar close event', async () => {
    const { result } = renderHook(() => useResetHandler());

    // Simulate closing Snackbar
    act(() => {
      result.current.handleSnackbarClose(undefined, 'clickaway');
    });

    expect(result.current.openSnackbar).toBe(false);

    act(() => {
      result.current.handleSnackbarClose();
    });

    expect(result.current.openSnackbar).toBe(false);
  });
});
