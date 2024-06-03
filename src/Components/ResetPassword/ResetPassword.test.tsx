/* eslint-disable react/react-in-jsx-scope */
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ResetPassword from './ResetPassword';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('ResetPassword component', () => {
  test('validates new password input correctly', () => {
    render(
      <Router>
        <ResetPassword />
      </Router>
    );
    const newPasswordInput = screen.getByPlaceholderText('New Password');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(newPasswordInput, { target: { value: 'test' } });
    fireEvent.blur(newPasswordInput);
    fireEvent.click(submitButton);

  });

  test('validates confirm password input correctly', () => {
    render(
      <Router>
        <ResetPassword />
      </Router>
    );
    const newPasswordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(newPasswordInput, { target: { value: 'Test1234' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Test1234' } });
    fireEvent.blur(confirmPasswordInput);
    fireEvent.click(submitButton);

    expect(screen.queryByText('Passwords must match')).toBeNull();
  });

  test('displays error message when passwords do not match', () => {
    render(
      <Router>
        <ResetPassword />
      </Router>
    );
    const newPasswordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(newPasswordInput, { target: { value: 'Test1234' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Different1234' } });
    fireEvent.blur(confirmPasswordInput);
    fireEvent.click(submitButton);

    expect(screen.getByText('Passwords must match')).toBeInTheDocument();
  });
});
