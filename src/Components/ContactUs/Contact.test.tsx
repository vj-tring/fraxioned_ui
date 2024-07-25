import React from 'react';
// import { render, fireEvent, screen } from '@testing-library/react';
// import '@testing-library/jest-dom';
// import Contact from './Contact';

// jest.mock('../../assets/Fraxioned-icon.png', () => 'Fraxioned-icon.png');

// describe('Contact component', () => {
//   it('renders contact form inputs correctly', () => {
//     render(<Contact />);
//     expect(screen.getByPlaceholderText('NAME')).toBeInTheDocument();
//     expect(screen.getByPlaceholderText('SUBJECT')).toBeInTheDocument();
//     expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: 'SEND' })).toBeInTheDocument();
//   });

//   it('updates form input values correctly', () => {
//     render(<Contact />);

//     const nameInput = screen.getByPlaceholderText('NAME');
//     const subjectInput = screen.getByPlaceholderText('SUBJECT');
//     const messageInput = screen.getByPlaceholderText('Enter your message');

//     fireEvent.change(nameInput, { target: { value: 'John Doe' } });
//     fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
//     fireEvent.change(messageInput, { target: { value: 'Test message content' } });
//   });

//   it('submits form with correct values', async () => {
//     render(<Contact />);

//     const nameInput = screen.getByPlaceholderText('NAME');
//     const subjectInput = screen.getByPlaceholderText('SUBJECT');
//     const messageInput = screen.getByPlaceholderText('Enter your message');
//     const sendButton = screen.getByRole('button', { name: 'SEND' });

//     fireEvent.change(nameInput, { target: { value: 'John Doe' } });
//     fireEvent.change(subjectInput, { target: { value: 'Test Subject' } });
//     fireEvent.change(messageInput, { target: { value: 'Test message content' } });

//     fireEvent.click(sendButton);
//   });
// });
