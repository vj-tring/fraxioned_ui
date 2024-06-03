/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ForgotPassword component', () => {
  test('displays error message for invalid email input', () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.click(submitButton);

    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  test('displays error message for empty email input', () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);

    expect(screen.getByText('Please enter your email')).toBeInTheDocument();
  });

  test('submits the form with valid email input and navigates to dashboard', () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(emailInput, { target: { value: 'valid@gmail.com' } });
    fireEvent.click(submitButton);

    expect(screen.queryByText('Invalid email address')).toBeNull();
    expect(screen.queryByText('Please enter your email')).toBeNull();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
