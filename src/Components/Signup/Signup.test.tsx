import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Signup from './Signup';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Signup component', () => {
  test('validates email input correctly', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(emailInput, { target: { value: 'valid@gmail.com' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Please enter a valid email address')).toBeNull();
  });

  test('validates fullname input correctly', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const fullNameInput = screen.getByPlaceholderText('Name');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(fullNameInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Please enter your full name')).toBeNull();
  });

  test('validates phone number input correctly', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const phoneInput = screen.getByPlaceholderText('PhoneNumber');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(phoneInput, { target: { value: '5677827988' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Please enter a valid 10-digit phone number')).toBeNull();
  });

  test('validates password input correctly', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const phoneInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(phoneInput, { target: { value: 'test12345' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Password must be 8 characters or longer')).toBeNull();
  });
});
