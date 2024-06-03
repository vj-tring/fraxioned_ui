/* eslint-disable react/react-in-jsx-scope */
import { render, fireEvent, screen } from '@testing-library/react';
import Signup from './Signup';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Signup component', () => {
  test('validates name input correctly', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const nameInput = screen.getByPlaceholderText('Enter your name');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.blur(nameInput);
    fireEvent.click(submitButton);
    expect(screen.getByText('Please enter your name')).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.blur(nameInput);
    fireEvent.click(submitButton);
    expect(screen.queryByText('Please enter your name')).toBeNull();
  });

  test('validates email input correctly', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    fireEvent.click(submitButton);
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'valid@gmail.com' } });
    fireEvent.blur(emailInput);
    fireEvent.click(submitButton);
    expect(screen.queryByText('Invalid email address')).toBeNull();
  });

  test('validates password input correctly', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);
    expect(screen.getByText('Password must be 8 characters or longer')).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: 'validPassword123' } });
    fireEvent.blur(passwordInput);
    fireEvent.click(submitButton);
    expect(screen.queryByText('Password must be 8 characters or longer')).toBeNull();
  });

  test('validates confirm password input correctly', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(passwordInput, { target: { value: 'validPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentPassword123' } });
    fireEvent.blur(confirmPasswordInput);
    fireEvent.click(submitButton);
    expect(screen.getByText('Passwords must match')).toBeInTheDocument();

    fireEvent.change(confirmPasswordInput, { target: { value: 'validPassword123' } });
    fireEvent.blur(confirmPasswordInput);
    fireEvent.click(submitButton);
    expect(screen.queryByText('Passwords must match')).toBeNull();
  });

  test('submits the form successfully with valid data', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'valid@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'validPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'validPassword123' } });
    fireEvent.click(submitButton);

    expect(screen.queryByText('Please enter your name')).toBeNull();
    expect(screen.queryByText('Invalid email address')).toBeNull();
    expect(screen.queryByText('Password must be 8 characters or longer')).toBeNull();
    expect(screen.queryByText('Passwords must match')).toBeNull();
    // You can add more assertions to check if the form submission was handled correctly
  });
});
