import React from 'react'; // Add this import
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Login from './Login';
import '@testing-library/jest-dom'
import useLoginHandler from './LoginApiHandler';

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

    test('renders Login component', () => {
        render(<Login />);
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    test('renders input fields and submit button', () => {
        render(<Login />);
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    test('calls formik handleSubmit on form submission', () => {
        render(<Login />);
        fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
        expect(mockedUseLoginHandler().formik.handleSubmit).toHaveBeenCalled();
    });

    test('displays email validation error', async () => {
        mockedUseLoginHandler.mockReturnValueOnce({
            ...mockedUseLoginHandler(),
            formik: {
                ...mockedUseLoginHandler().formik,
                touched: { email: true, password: false },
                errors: { email: 'Email is required', password: '' },
            }
        });

        render(<Login />);
        fireEvent.blur(screen.getByPlaceholderText('Email'));
        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument();
        });
    });

    test('displays password validation error', async () => {
        mockedUseLoginHandler.mockReturnValueOnce({
            ...mockedUseLoginHandler(),
            formik: {
                ...mockedUseLoginHandler().formik,
                touched: { email: false, password: true },
                errors: { email: '', password: 'Password is required' },
            }
        });

        render(<Login />);
        fireEvent.blur(screen.getByPlaceholderText('Password'));
        await waitFor(() => {
            expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
    });

    test('renders Snackbar when openSnackbar is true', () => {
        mockedUseLoginHandler.mockReturnValueOnce({
            ...mockedUseLoginHandler(),
            openSnackbar: true,
            snackbarMessage: 'Test Message',
            snackbarSeverity: 'error',
        });

        render(<Login />);
        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });
});