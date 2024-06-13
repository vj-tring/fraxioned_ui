import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './Login';
import useLoginHandler from './LoginApiHandler';
import '@testing-library/jest-dom';

jest.mock('./LoginApiHandler');

const mockedUseLoginHandler = useLoginHandler as jest.MockedFunction<typeof useLoginHandler>;

describe('Login Component', () => {
    beforeEach(() => {
        mockedUseLoginHandler.mockReturnValue({
            formik: {
                initialValues: { email: '', password: '' },
                initialErrors: {},
                initialTouched: {},
                initialStatus: null,
                handleSubmit: jest.fn(),
                handleChange: jest.fn(),
                handleBlur: jest.fn(),
                touched: { email: false, password: false },
                errors: { email: '', password: '' },
                values: { email: '', password: '' },
                isSubmitting: false,
                isValidating: false,
                isValid: true,
                dirty: false,
                validateOnBlur: true,
                validateOnChange: true,
                validateOnMount: false,
                submitForm: jest.fn(),
                resetForm: jest.fn(),
                setErrors: jest.fn(),
                setFieldError: jest.fn(),
                setFieldTouched: jest.fn(),
                setFieldValue: jest.fn(),
                setFormikState: jest.fn(),
                setStatus: jest.fn(),
                setSubmitting: jest.fn(),
                setTouched: jest.fn(),
                setValues: jest.fn(),
                submitCount: 0,
                validateField: jest.fn(),
                validateForm: jest.fn(),
                getFieldMeta: jest.fn(),
                getFieldHelpers: jest.fn(),
                getFieldProps: jest.fn(),
                handleReset: jest.fn(),
                unregisterField: jest.fn(),
                registerField: jest.fn()
            },
            openSnackbar: false,
            snackbarMessage: '',
            snackbarSeverity: 'success',
            handleSnackbarClose: jest.fn(),
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form', () => {
        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    test('shows validation errors on form submit', async () => {
        const handleSubmit = jest.fn((e) => e?.preventDefault());
        
        mockedUseLoginHandler.mockReturnValueOnce({
            ...mockedUseLoginHandler(),
            formik: {
                ...mockedUseLoginHandler().formik,
                handleSubmit,
                touched: { email: true, password: true },
                errors: { email: 'Invalid email address', password: 'Password must be 8 characters or longer' },
            },
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Invalid email address')).toBeInTheDocument();
            expect(screen.getByText('Password must be 8 characters or longer')).toBeInTheDocument();
        });

        expect(handleSubmit).toHaveBeenCalled();
    });

    test('displays email validation error on blur', async () => {
        mockedUseLoginHandler.mockReturnValueOnce({
            ...mockedUseLoginHandler(),
            formik: {
                ...mockedUseLoginHandler().formik,
                touched: { email: true, password: false },
                errors: { email: 'Email is required', password: '' },
            }
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.blur(screen.getByPlaceholderText('Email'));

        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
    });

    test('displays password validation error on blur', async () => {
        mockedUseLoginHandler.mockReturnValueOnce({
            ...mockedUseLoginHandler(),
            formik: {
                ...mockedUseLoginHandler().formik,
                touched: { email: false, password: true },
                errors: { email: '', password: 'Password is required' },
            }
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        fireEvent.blur(screen.getByPlaceholderText('Password'));

        await waitFor(() => {
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
    });

    test('displays snackbar on successful login', async () => {
        mockedUseLoginHandler.mockReturnValueOnce({
            ...mockedUseLoginHandler(),
            formik: {
                ...mockedUseLoginHandler().formik,
                handleSubmit: jest.fn((e) => e?.preventDefault()),
            },
            openSnackbar: true,
            snackbarMessage: 'Login successful!',
            snackbarSeverity: 'success',
            handleSnackbarClose: jest.fn(),
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Login successful!')).toBeInTheDocument();
        });
    });

    test('displays snackbar on login failure', async () => {
        mockedUseLoginHandler.mockReturnValueOnce({
            ...mockedUseLoginHandler(),
            formik: {
                ...mockedUseLoginHandler().formik,
                handleSubmit: jest.fn((e) => e?.preventDefault()),
            },
            openSnackbar: true,
            snackbarMessage: 'Invalid Credentials!',
            snackbarSeverity: 'error',
            handleSnackbarClose: jest.fn(),
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        await waitFor(() => {
            expect(screen.getByText('Invalid Credentials!')).toBeInTheDocument();
        });
    });

    test('renders Snackbar when openSnackbar is true', () => {
        mockedUseLoginHandler.mockReturnValueOnce({
            ...mockedUseLoginHandler(),
            openSnackbar: true,
            snackbarMessage: 'Test Message',
            snackbarSeverity: 'error',
        });

        render(
            <Router>
                <Login />
            </Router>
        );

        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });
});
