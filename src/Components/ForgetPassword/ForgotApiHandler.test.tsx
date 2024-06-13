import { renderHook, act } from '@testing-library/react-hooks';
import useForgotHandler from './ForgotApiHandler';
import { forgotPassword } from '../../Api/ForgotApi';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('../../Api/ForgotApi', () => ({
  forgotPassword: jest.fn(),
}));

describe('useForgotHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('handles successful forgot password request', async () => {
    // Mock successful API response
    (forgotPassword as jest.Mock).mockResolvedValueOnce({});

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useForgotHandler());

    // Trigger form submission
    await act(async () => {
      await result.current.formik.handleSubmit({} as React.FormEvent<HTMLFormElement>);
      await waitForNextUpdate(); // Wait for state updates
    });

    // Assertions
    expect(result.current.openSnackbar).toBe(true);
    expect(result.current.snackbarMessage).toBe('Password reset email sent successfully!');
    expect(result.current.snackbarSeverity).toBe('success');
    // You may add more assertions related to navigation if needed
  });

  test('handles error in forgot password request', async () => {
    // Mock error response
    const mockError = new Error('Failed to send password reset email');
    (forgotPassword as jest.Mock).mockRejectedValueOnce(mockError);

    // Render the hook
    const { result, waitForNextUpdate } = renderHook(() => useForgotHandler());

    // Trigger form submission
    await act(async () => {
      await result.current.formik.handleSubmit({} as React.FormEvent<HTMLFormElement>);
      await waitForNextUpdate(); // Wait for state updates
    });

    // Assertions
    expect(result.current.openSnackbar).toBe(true);
    expect(result.current.snackbarMessage).toBe('Error sending password reset email!');
    expect(result.current.snackbarSeverity).toBe('error');
    // You may add more assertions related to handling of errors
  });
});
