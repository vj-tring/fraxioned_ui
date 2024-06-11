import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers
import Signup from './Signup';

describe('Signup Component', () => {
  it('renders the signup form', () => {
    render(<Signup />);
    
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(' Username')).toBeInTheDocument();
  });

  it('submits the form with valid input', async () => {
    const mockSignupHandler = jest.fn();
    jest.mock('./SignupApiHandler', () => () => ({
      formik: {
        handleSubmit: mockSignupHandler,
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        values: {
          name: 'John Doe',
          // Add values for other fields
        },
        touched: {},
        errors: {},
      },
      openSnackbar: false,
      snackbarMessage: '',
      snackbarSeverity: '',
      handleSnackbarClose: jest.fn(),
    }));

    render(<Signup />);
    
    // Submit the form
    fireEvent.click(screen.getByText('Submit'));
    expect(mockSignupHandler).toHaveBeenCalled();
  });

  it('displays error messages for invalid input', () => {
    jest.mock('./SignupApiHandler', () => () => ({
      formik: {
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        values: {},
        touched: {
          name: true,
          // Add other fields with true to indicate they are touched
        },
        errors: {
          name: 'Please enter your name',
          // Add error messages for other fields
        },
      },
      openSnackbar: false,
      snackbarMessage: '',
      snackbarSeverity: '',
      handleSnackbarClose: jest.fn(),
    }));

    render(<Signup />);
    
    // Expect error messages to be displayed
    expect(screen.getByText('Please enter your name')).toBeInTheDocument();
    // Add similar expectations for other error messages
  });
});
