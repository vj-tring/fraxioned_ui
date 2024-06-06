import { render, screen, fireEvent } from '@testing-library/react';
import Contact from './Contact';

describe('Contact Component', () => {
  test('renders contact form elements', () => {
    render(<Contact />);

    expect(screen.getByLabelText('EMAILING OWNERS@FRAXIONED.COM')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter the subject')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your message')).toBeInTheDocument();
    expect(screen.getByText('SEND')).toBeInTheDocument();
  });

  test('fills out form and submits', () => {
    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText('Enter your name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Enter the subject'), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByPlaceholderText('Enter your message'), { target: { value: 'Test Message' } });
    fireEvent.click(screen.getByText('SEND'));

    // Add your assertions here
    // For example, you could check if a success message appears after submission
    // expect(screen.getByText('Message sent successfully')).toBeInTheDocument();
  });
});
