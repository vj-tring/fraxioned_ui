/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable react/react-in-jsx-scope */
import { render, fireEvent, screen, act, waitForElementToBeRemoved } from '@testing-library/react';
import Signup from './Signup';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Signup component', () => {
  test('validates name input correctly', async () => {
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
  
    // Wait for the error message to be displayed
    await screen.findByText('Please enter your name');
    expect(screen.getByText('Please enter your name')).toBeInTheDocument();
  
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.blur(nameInput);
    fireEvent.click(submitButton);
  
    // Wait for the error message to disappear
    await waitForElementToBeRemoved(() => screen.queryByText('Please enter your name'));
    expect(screen.queryByText('Please enter your name')).toBeNull();
  });
  

  test('validates email input correctly', async () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);
      fireEvent.click(submitButton);
    });
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'valid@gmail.com' } });
      fireEvent.blur(emailInput);
      fireEvent.click(submitButton);
    });
    expect(screen.queryByText('Invalid email address')).toBeNull();
  });

  test('validates password input correctly', async () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.blur(passwordInput);
      fireEvent.click(submitButton);
    });
    expect(screen.getByText('Password must be 8 characters or longer')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'validPassword123' } });
      fireEvent.blur(passwordInput);
      fireEvent.click(submitButton);
    });
    expect(screen.queryByText('Password must be 8 characters or longer')).toBeNull();
  });

  test('validates confirm password input correctly', async () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password');
    const submitButton = screen.getByText('Submit');

    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'validPassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentPassword123' } });
      fireEvent.blur(confirmPasswordInput);
      fireEvent.click(submitButton);
    });
    expect(screen.getByText('Passwords must match')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(confirmPasswordInput, { target: { value: 'validPassword123' } });
      fireEvent.blur(confirmPasswordInput);
      fireEvent.click(submitButton);
    });
    expect(screen.queryByText('Passwords must match')).toBeNull();
  });

  test('submits the form successfully with valid data', async () => {
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

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'valid@gmail.com' } });
      fireEvent.change(passwordInput, { target: { value: 'validPassword123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'validPassword123' } });
      fireEvent.click(submitButton);
    });

    expect(screen.queryByText('Please enter your name')).toBeNull();
    expect(screen.queryByText('Invalid email address')).toBeNull();
    expect(screen.queryByText('Password must be 8 characters or longer')).toBeNull();
    expect(screen.queryByText('Passwords must match')).toBeNull();
  });
});
