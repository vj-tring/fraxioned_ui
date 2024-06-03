import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ForgotPassword component', () => {
  test('validates email input correctly', () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.click(submitButton);
    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('displays error message when email is empty', () => {
    render(
      <Router>
        <ForgotPassword />
      </Router>
    );
    const submitButton = screen.getByText('Submit');

    fireEvent.click(submitButton);
    expect(screen.getByText('Please enter your email')).toBeInTheDocument();
  });
});
