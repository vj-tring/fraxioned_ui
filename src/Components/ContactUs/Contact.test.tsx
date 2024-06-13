// Contact.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import axios from 'axios';
import Contact from './Contact';


import { PortURL } from '../config';
import CustomizedSnackbars from '../CustomizedSnackbars/CustomizedSnackbars';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../CustomizedSnackbars/CustomizedSnackbars', () => (props: any) => (
  <div>{props.message}</div>
));

describe('Contact Component', () => {
  test('renders the contact form and submits successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: 'Message sent successfully!' });

    render(<Contact />);

    // Fill out the form fields
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter the subject'), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your message'), { target: { value: 'This is a test message.' } });

    // Submit the form
    fireEvent.click(screen.getByText('SEND'));

    // Find the snackbar and check for success message
    const successMessage = await screen.findByText('Message sent successfully!');
    expect(successMessage).toBeInTheDocument();

    // Check if the input fields are cleared after submission
    expect(screen.getByPlaceholderText('Enter your name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter the subject')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter your message')).toHaveValue('');
  });

  test('renders the contact form and handles submission error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Error sending message'));

    render(<Contact />);

    // Fill out the form fields
    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter the subject'), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your message'), { target: { value: 'This is a test message.' } });

    // Submit the form
    fireEvent.click(screen.getByText('SEND'));

    // Find the snackbar and check for error message
    const errorMessage = await screen.findByText('Error sending message. Please try again.');
    expect(errorMessage).toBeInTheDocument();

    // Ensure the input fields are not cleared after an error
    expect(screen.getByPlaceholderText('Enter your name')).toHaveValue('John Doe');
    expect(screen.getByPlaceholderText('Enter the subject')).toHaveValue('Test Subject');
    expect(screen.getByPlaceholderText('Enter your message')).toHaveValue('This is a test message.');
  });
});
