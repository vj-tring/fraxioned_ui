import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Signup from './Signup';
import { BrowserRouter as Router } from 'react-router-dom';

// Mocking useNavigate hook
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
    const emailInput = screen.getByPlaceholderText('Enter email address here');
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
    const fullNameInput = screen.getByPlaceholderText('Enter full name');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(fullNameInput, { target: { value: 'test' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Please enter a valid Name address')).toBeNull();
  });

  test('validates phome number input correctly', () => {
    render(
      <Router>
        <Signup />
      </Router>
    );
    const phoneInput = screen.getByPlaceholderText('Enter phone number');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(phoneInput, { target: { value: '56778279886' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Please enter a valid Phone Number')).toBeNull();
  });
  

  // Write similar tests for other validations
});
