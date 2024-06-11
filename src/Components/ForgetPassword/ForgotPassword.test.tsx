/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ForgotPassword component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays error message for invalid email input', async () => {
    await act(async () => {
      render(
        <Router>
          <ForgotPassword />
        </Router>
      );
    });

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  test('displays error message for empty email input', async () => {
    await act(async () => {
      render(
        <Router>
          <ForgotPassword />
        </Router>
      );
    });

    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(screen.getByText('Please enter your email')).toBeInTheDocument();
  });

  test('submits the form with valid email input and navigates to dashboard', async () => {
    await act(async () => {
      render(
        <Router>
          <ForgotPassword />
        </Router>
      );
    });

    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'valid@gmail.com' } });
      fireEvent.click(submitButton);
    });

    expect(screen.queryByText('Invalid email address')).toBeNull();
    expect(screen.queryByText('Please enter your email')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
