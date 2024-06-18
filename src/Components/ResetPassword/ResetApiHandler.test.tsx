import { renderHook, act } from '@testing-library/react-hooks';
import useResetHandler from './ResetApiHandler';
import { useNavigate, useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { resetPassword } from '../../Api/ResetApi'; 
// import { ResetPasswordPayload } from '../Types/Reset'; 

jest.mock('axios');
jest.mock('../../Api/ResetApi');
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>;
const mockedUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;

describe('useResetHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseNavigate.mockReturnValue(jest.fn());
    mockedUseLocation.mockReturnValue({
      search: '?token=test-token',
      state: undefined,
      key: '',
      pathname: '',
      hash: ''
    }); // Mocking URL search params
  });

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

  // test('handles successful password reset', async () => {
  //   const mockPayload: ResetPasswordPayload = { newPassword: 'newPassword', confirmPassword: 'newPassword' };
  //   const mockSuccessResponse = { data: { message: 'Password reset successfully!' } };

  //   // Mock resetPassword API call
  //   (resetPassword as jest.Mock).mockResolvedValueOnce(mockSuccessResponse);

  //   // Render the hook
  //   const { result, waitForNextUpdate } = renderHook(() => useResetHandler());

  //   // Execute form submission
  //   await act(async () => {
  //     await result.current.formik.handleSubmit();
  //   });

  //   // Assertions
  //   expect(resetPassword).toHaveBeenCalledWith(mockPayload, 'test-token');
  //   expect(result.current.openSnackbar).toBe(true);
  //   expect(result.current.snackbarMessage).toBe('Password reset successfully!');
  //   expect(result.current.snackbarSeverity).toBe('success');

  //   // Wait for state update
  //   await waitForNextUpdate();

  //   // Additional assertions if navigation or other side effects occur
  //   // e.g., expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  // });

  // test('handles error in password reset', async () => {
  //   const mockError = new Error('Failed to reset password');
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
  //   expect(resetPassword).toHaveBeenCalledWith(mockPayload, 'test-token');
  //   expect(result.current.openSnackbar).toBe(true);
  //   expect(result.current.snackbarMessage).toBe('Error resetting password!');
  //   expect(result.current.snackbarSeverity).toBe('error');

  //   // Wait for state update
  //   await waitForNextUpdate();
  // });

  // test('handles unknown error in password reset', async () => {
  //   const mockError = new Error('Network Error');
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
  //   expect(resetPassword).toHaveBeenCalledWith(mockPayload, 'test-token');
  //   expect(result.current.openSnackbar).toBe(true);
  //   expect(result.current.snackbarMessage).toBe('An unknown error occurred');
  //   expect(result.current.snackbarSeverity).toBe('error');

  //   // Wait for state update
  //   await waitForNextUpdate();
  // });
});
