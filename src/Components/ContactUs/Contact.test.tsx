import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contact from './Contact';

describe('Contact component', () => {
  it('renders contact form inputs correctly', () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter the subject')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SEND' })).toBeInTheDocument();
  });

  it('updates form input values correctly', () => {
    render(<Contact />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const subjectInput = screen.getByPlaceholderText('Enter the subject');
    const messageInput = screen.getByPlaceholderText('Enter your message');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message content' } });
  });

  it('submits form with correct values', async () => {
    render(<Contact />);

    const nameInput = screen.getByPlaceholderText('Enter your name');
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const subjectInput = screen.getByPlaceholderText('Enter the subject');
    const messageInput = screen.getByPlaceholderText('Enter your message');
    const sendButton = screen.getByRole('button', { name: 'SEND' });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
    fireEvent.change(messageInput, { target: { value: 'Test message content' } });

    fireEvent.click(sendButton);
  });
});
