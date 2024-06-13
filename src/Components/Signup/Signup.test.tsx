import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Signup from './Signup';
import '@testing-library/jest-dom';
import useSignupHandler from './SignupApiHandler';

jest.mock('./SignupApiHandler');

const mockedUseSignupHandler = useSignupHandler as jest.MockedFunction<typeof useSignupHandler>;

describe('Signup Component', () => {
  beforeEach(() => {
    mockedUseSignupHandler.mockReturnValue({
      formik: {
        initialValues: {
          username: '',
          phone: '',
          secondaryPhone: '',
          secondaryEmail: '',
          address1: '',
          address2: '',
          state: '',
          city: '',
          zip: '',
          imageUrl: '',
          password: '',
          confirmPassword: ''
        },
        initialErrors: {},
        initialTouched: {},
        initialStatus: null,
        handleSubmit: jest.fn(),
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        touched: {},
        errors: {},
        values: {
          username: '',
          phone: '',
          secondaryPhone: '',
          secondaryEmail: '',
          address1: '',
          address2: '',
          state: '',
          city: '',
          zip: '',
          imageUrl: '',
          password: '',
          confirmPassword: ''
        },
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

  test('renders Signup component', () => {
    render(<Signup />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('displays validation errors for required fields', async () => {
    mockedUseSignupHandler.mockReturnValueOnce({
      ...mockedUseSignupHandler(),
      formik: {
        ...mockedUseSignupHandler().formik,
        touched: {
          username: true,
          phone: true,
          address1: true,
          state: true,
          city: true,
          zip: true,
          password: true,
          confirmPassword: true
        },
        errors: {
          username: 'Please enter your username',
          phone: 'Please enter your phone number',
          address1: 'Please enter your address line 1',
          state: 'Please enter your state',
          city: 'Please enter your city',
          zip: 'Please enter your zip code',
          password: 'Please enter a password',
          confirmPassword: 'Please confirm your password'
        },
      }
    });

    render(<Signup />);
    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Please enter your username')).toBeInTheDocument();
    });
    expect(screen.getByText('Please enter your phone number')).toBeInTheDocument();
    expect(screen.getByText('Please enter your address line 1')).toBeInTheDocument();
    expect(screen.getByText('Please enter your state')).toBeInTheDocument();
    expect(screen.getByText('Please enter your city')).toBeInTheDocument();
    expect(screen.getByText('Please enter your zip code')).toBeInTheDocument();
    expect(screen.getByText('Please enter a password')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument();
  });

  test('displays validation errors for specific field formats', async () => {
    mockedUseSignupHandler.mockReturnValueOnce({
      ...mockedUseSignupHandler(),
      formik: {
        ...mockedUseSignupHandler().formik,
        touched: {
          phone: true,
          secondaryEmail: true,
          zip: true,
          imageUrl: true,
          password: true,
          confirmPassword: true
        },
        errors: {
          phone: 'Phone number must be 10 digits',
          secondaryEmail: 'Invalid email format',
          zip: 'Zip code must be 5 digits',
          imageUrl: 'Invalid URL format',
          password: 'Password must be 8 characters or longer',
          confirmPassword: 'Passwords must match'
        },
      }
    });

    render(<Signup />);
    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Phone number must be 10 digits')).toBeInTheDocument();
    });
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    expect(screen.getByText('Zip code must be 5 digits')).toBeInTheDocument();
    expect(screen.getByText('Invalid URL format')).toBeInTheDocument();
    expect(screen.getByText('Password must be 8 characters or longer')).toBeInTheDocument();
    expect(screen.getByText('Passwords must match')).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    const mockSubmit = jest.fn().mockImplementation((event) => {
      event.preventDefault();
      return Promise.resolve();
    });

    mockedUseSignupHandler.mockReturnValueOnce({
      ...mockedUseSignupHandler(),
      formik: {
        ...mockedUseSignupHandler().formik,
        values: {
          username: 'testuser',
          phone: '1234567890',
          secondaryPhone: '',
          secondaryEmail: '',
          address1: '123 Main St',
          address2: '',
          state: 'CA',
          city: 'San Francisco',
          zip: '94105',
          imageUrl: '',
          password: 'password123',
          confirmPassword: 'password123'
        },
        handleSubmit: mockSubmit,
        errors: {},
        touched: {}
      },
      openSnackbar: true,
      snackbarMessage: 'Signup successful!',
      snackbarSeverity: 'success',
    });

    render(<Signup />);
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/address line 1/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText(/state/i), { target: { value: 'CA' } });
    fireEvent.change(screen.getByPlaceholderText(/city/i), { target: { value: 'San Francisco' } });
    fireEvent.change(screen.getByPlaceholderText(/zip code/i), { target: { value: '94105' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Signup successful!')).toBeInTheDocument();
    });

    expect(mockSubmit).toHaveBeenCalled();
  });

  test('handles form submission error', async () => {
    const mockSubmit = jest.fn().mockImplementation((event) => {
      event.preventDefault();
      return Promise.reject(new Error('Network Error'));
    });

    mockedUseSignupHandler.mockReturnValueOnce({
      ...mockedUseSignupHandler(),
      formik: {
        ...mockedUseSignupHandler().formik,
        values: {
          username: 'testuser',
          phone: '1234567890',
          secondaryPhone: '',
          secondaryEmail: '',
          address1: '123 Main St',
          address2: '',
          state: 'CA',
          city: 'San Francisco',
          zip: '94105',
          imageUrl: '',
          password: 'password123',
          confirmPassword: 'password123'
        },
        handleSubmit: mockSubmit,
        errors: {},
        touched: {}
      },
      openSnackbar: true,
      snackbarMessage: 'Failed to signup. Please try again later.',
      snackbarSeverity: 'error',
    });

    render(<Signup />);
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByPlaceholderText(/address line 1/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByPlaceholderText(/state/i), { target: { value: 'CA' } });
    fireEvent.change(screen.getByPlaceholderText(/city/i), { target: { value: 'San Francisco' } });
    fireEvent.change(screen.getByPlaceholderText(/zip code/i), { target: { value: '94105' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm your password/i), { target: { value: 'password123' } });

    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to signup. Please try again later.')).toBeInTheDocument();
    });

    expect(mockSubmit).toHaveBeenCalled();
  });

  test('handles Snackbar close event', async () => {
    mockedUseSignupHandler.mockReturnValueOnce({
      ...mockedUseSignupHandler(),
      openSnackbar: true,
      snackbarMessage: 'Signup successful!',
      snackbarSeverity: 'success',
    });

    render(<Signup />);
    const closeButton = screen.getByLabelText('close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Signup successful!')).not.toBeInTheDocument();
    });

    expect(mockedUseSignupHandler().handleSnackbarClose).toHaveBeenCalled();
  });
});

