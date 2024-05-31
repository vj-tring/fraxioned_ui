import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import Login from './Login';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Login Component', () => {
  test('renders login form with inputs and submit button', () => {
    renderWithRouter(<Login />);

    expect(screen.getByPlaceholderText('Enter email address here')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('shows error message when email is empty', () => {
    renderWithRouter(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Please enter your email')).toBeInTheDocument();
  });

  test('shows error message when email is invalid', () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Enter email address here'), { target: { value: 'invalid-email' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
  });

  test('shows error message when password is empty', () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Enter email address here'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Please enter a password')).toBeInTheDocument();
  });

  test('shows error message when password is less than 8 characters', () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Enter email address here'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password here'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Password must be 8 characters or longer')).toBeInTheDocument();
  });

  test('navigates to dashboard when form is valid', () => {
    const mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    renderWithRouter(<Login />);

    fireEvent.change(screen.getByPlaceholderText('Enter email address here'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password here'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

export {};
