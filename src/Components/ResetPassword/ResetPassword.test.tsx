/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ResetPassword component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('validates new password input correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <ResetPassword />
        </Router>
      );
    });

    const newPasswordInput = screen.getByPlaceholderText('New Password');
    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.change(newPasswordInput, { target: { value: 'test' } });
      fireEvent.blur(newPasswordInput);
      fireEvent.click(submitButton);
    });

    // Add your validation check here if needed
  });

  test('validates confirm password input correctly', async () => {
    await act(async () => {
      render(
        <Router>
          <ResetPassword />
        </Router>
      );
    });

    const newPasswordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.change(newPasswordInput, { target: { value: 'Test1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Test1234' } });
      fireEvent.blur(confirmPasswordInput);
      fireEvent.click(submitButton);
    });

    expect(screen.queryByText('Passwords must match')).toBeNull();
  });

  test('displays error message when passwords do not match', async () => {
    await act(async () => {
      render(
        <Router>
          <ResetPassword />
        </Router>
      );
    });

    const newPasswordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.change(newPasswordInput, { target: { value: 'Test1234' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'Different1234' } });
      fireEvent.blur(confirmPasswordInput);
      fireEvent.click(submitButton);
    });

    expect(screen.getByText('Passwords must match')).toBeInTheDocument();
  });
});
