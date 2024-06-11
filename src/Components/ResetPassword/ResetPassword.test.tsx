import React from 'react';
import { render, fireEvent,  screen } from '@testing-library/react';
import ResetPassword from './ResetPassword';


describe('ResetPassword component', () => {
  it('renders correctly', () => {
    render(<ResetPassword />);
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });

  it('displays error messages for invalid input', () => {
    render(<ResetPassword />);
    const newPasswordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

    fireEvent.change(newPasswordInput, { target: { value: 'hort' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'hort' } });

    expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
  });

  it('displays success message when form is submitted successfully', () => {
    render(<ResetPassword />);
    const newPasswordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    expect(screen.getByText('Password reset successfully')).toBeInTheDocument();
  });

  it('calls the onSubmit function when the form is submitted', () => {
    const onSubmit = jest.fn();
    const newPasswordInput = screen.getByPlaceholderText('New Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');

    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});