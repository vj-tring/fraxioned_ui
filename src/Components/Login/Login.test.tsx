import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login'; 
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));
 describe('Login Component', () => {
  test('validates email input correctly', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(emailInput, { target: { value: 'valid@gmail.com' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Please enter a valid email address')).toBeNull();
  });

  test('validates password input correctly', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const phoneInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(phoneInput, { target: { value: 'test12345' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText('Password must be 8 characters or longer')).toBeNull();
  });

  test('navigates to dashboard when form is valid', () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    
      fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
      // Add your assertions here
      // expect(screen.queryByText('Invalid Credentials')).toBeNull();
    });
 })


