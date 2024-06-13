import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForgotPassword from './ForgotPassword';
import useForgotHandler from './ForgotApiHandler';

jest.mock('./ForgotApiHandler');
const mockedUseForgotHandler = useForgotHandler as jest.MockedFunction<typeof useForgotHandler>;

describe('ForgotPassword Component', () => {
  beforeEach(() => {
    mockedUseForgotHandler.mockReturnValue({
      formik: {
        initialValues: { email: '' },
        initialErrors: {},
        initialTouched: {},
        handleSubmit: jest.fn(),
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        values: { email: '' },
        touched: {},
        errors: {},
        initialStatus: undefined,
        handleReset: jest.fn(),
        resetForm: jest.fn(),
        setErrors: jest.fn(),
        setFormikState: jest.fn(),
        setFieldTouched: jest.fn(),
        setFieldValue: jest.fn(),
        setFieldError: jest.fn(),
        setStatus: jest.fn(),
        setSubmitting: jest.fn(),
        setTouched: jest.fn(),
        setValues: jest.fn(),
        submitForm: jest.fn(),
        validateForm: jest.fn(),
        validateField: jest.fn(),
        isValid: false,
        dirty: false,
        unregisterField: jest.fn(),
        registerField: jest.fn(),
        getFieldProps: jest.fn(),
        getFieldMeta: jest.fn(),
        getFieldHelpers: jest.fn(),
        validateOnBlur: false,
        validateOnChange: false,
        validateOnMount: false,
        isSubmitting: false,
        isValidating: false,
        submitCount: 0,
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

  test('renders ForgotPassword component', () => {
    render(<ForgotPassword />);
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
  });

  test('renders email input and submit button', () => {
    render(<ForgotPassword />);
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  test('calls handleChange on email input change', () => {
    const mockHandleChange = jest.fn();
    mockedUseForgotHandler.mockReturnValueOnce({
      ...mockedUseForgotHandler(),
      formik: {
        ...mockedUseForgotHandler().formik,
        handleChange: mockHandleChange,
      },
    });

    render(<ForgotPassword />);
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'test@example.com' },
    });

    expect(mockHandleChange).toHaveBeenCalled();
  });

  test('calls handleSubmit on form submission', () => {
    const mockHandleSubmit = jest.fn();
    mockedUseForgotHandler.mockReturnValueOnce({
      ...mockedUseForgotHandler(),
      formik: {
        ...mockedUseForgotHandler().formik,
        handleSubmit: mockHandleSubmit,
      },
    });

    render(<ForgotPassword />);
    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test('displays email validation error', async () => {
    mockedUseForgotHandler.mockReturnValueOnce({
      ...mockedUseForgotHandler(),
      formik: {
        ...mockedUseForgotHandler().formik,
        touched: { email: true },
        errors: { email: 'Email is required' },
      },
    });

    render(<ForgotPassword />);
    fireEvent.blur(screen.getByPlaceholderText('Enter your email'));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  test('renders Snackbar when openSnackbar is true', () => {
    mockedUseForgotHandler.mockReturnValueOnce({
      ...mockedUseForgotHandler(),
      openSnackbar: true,
      snackbarMessage: 'Test message',
      snackbarSeverity: 'success',
    });

    render(<ForgotPassword />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('handles form submission success', async () => {
    mockedUseForgotHandler.mockReturnValueOnce({
      ...mockedUseForgotHandler(),
      formik: {
        ...mockedUseForgotHandler().formik,
        handleSubmit: async () => {
          // Simulate successful form submission
          return Promise.resolve();
        },
      },
    });

    render(<ForgotPassword />);
    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    // Ensure success Snackbar is displayed
    await waitFor(() => {
      expect(screen.getByText('Password reset email sent successfully!')).toBeInTheDocument();
    });

    // Ensure navigation to password reset page is triggered
    expect(window.location.pathname).toBe('/password-reset');
  });

  test('handles form submission error', async () => {
    mockedUseForgotHandler.mockReturnValueOnce({
      ...mockedUseForgotHandler(),
      formik: {
        ...mockedUseForgotHandler().formik,
        handleSubmit: async () => {
          // Simulate error during form submission
          throw new Error('Error sending password reset email!');
        },
      },
    });

    render(<ForgotPassword />);
    fireEvent.submit(screen.getByRole('button', { name: /Submit/i }));

    // Ensure error Snackbar is displayed
    await waitFor(() => {
      expect(screen.getByText('Error sending password reset email!')).toBeInTheDocument();
    });
  });

  test('validates email input for invalid email address', async () => {
    render(<ForgotPassword />);
    fireEvent.change(screen.getByPlaceholderText('Enter your email'), {
      target: { value: 'invalidemail' },
    });

    // Ensure validation error is displayed
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });
});
