import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import Dashboard from './Dashboard1';

describe('Dashboard Component', () => {
  test('renders Dashboard component with Navbar and Footer', () => {
    render(<Dashboard />);
    // Check if Navbar is rendered
    expect(screen.getByText('HOME')).toBeInTheDocument();
    // Check if Footer is rendered
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders Home component within Dashboard', () => {
    render(<Dashboard />);
    // Check if Home component is rendered
    expect(screen.getByText('Welcome to Fraxioned!')).toBeInTheDocument();
  });

  test('opens and closes ContactModal when needed', () => {
    render(<Dashboard />);
    // Initially, ContactModal should not be rendered
    expect(screen.queryByText('Contact Modal Content')).not.toBeInTheDocument();
    // Trigger the function to open the modal
    const contactUsButton = screen.getByText('Contact Us');
    fireEvent.click(contactUsButton);
    // After click, ContactModal content should be rendered
    expect(screen.getByText('Contact Modal Content')).toBeInTheDocument();
    // Trigger the function to close the modal
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    // After click, ContactModal content should not be rendered
    expect(screen.queryByText('Contact Modal Content')).not.toBeInTheDocument();
  });
});