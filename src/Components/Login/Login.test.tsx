import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import useLoginHandler from './LoginApiHandler';

// Mock the useLoginHandler hook
jest.mock('./LoginApiHandler');

const mockedUseLoginHandler = useLoginHandler as jest.Mock;

describe('Login Component', () => {
    const mockFormik = {
        handleSubmit: jest.fn((e) => e.preventDefault()),
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        values: { email: '', password: '' },
        touched: { email: false, password: false },
        errors: { email: '', password: '' },
    };

    beforeEach(() => {
        mockedUseLoginHandler.mockReturnValue({
            formik: mockFormik,
            openSnackbar: false,
            snackbarMessage: '',
            snackbarSeverity: 'info',
            handleSnackbarClose: jest.fn(),
        });
    });

    test('renders the login form', () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('shows validation errors', () => {
        mockFormik.touched = { email: true, password: true };
        mockFormik.errors = { email: 'Invalid email', password: 'Invalid password' };

        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByText('Invalid email')).toBeInTheDocument();
        expect(screen.getByText('Invalid password')).toBeInTheDocument();
    });

    test('calls formik handleSubmit on form submission', () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        expect(mockFormik.handleSubmit).toHaveBeenCalled();
    });

    test('shows snackbar with message', () => {
        mockedUseLoginHandler.mockReturnValueOnce({
            formik: mockFormik,
            openSnackbar: true,
            snackbarMessage: 'Login successful',
            snackbarSeverity: 'success',
            handleSnackbarClose: jest.fn(),
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByText('Login successful')).toBeInTheDocument();
    });

    test('navigates to forgot password page', () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.click(screen.getByText('Forgot Password?'));
        expect(window.location.pathname).toBe('/forgot-password');
    });

    test('handles form submission with API', async () => {
        const mockSubmit = jest.fn((e) => e.preventDefault());
        mockedUseLoginHandler.mockReturnValueOnce({
            formik: {
                ...mockFormik,
                handleSubmit: mockSubmit,
                values: { email: 'test@example.com', password: 'password' },
            },
            openSnackbar: true,
            snackbarMessage: 'Login successful',
            snackbarSeverity: 'success',
            handleSnackbarClose: jest.fn(),
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password' },
        });
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalled();    
        });
        await waitFor(() => {
            expect(screen.getByText('Login successful')).toBeInTheDocument();
        })
    });
});
