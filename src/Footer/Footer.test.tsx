import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import Footer from './Footer';

describe('Footer Component', () => {
  test('renders Footer component with links', () => {
    render(<Footer />);
    // Check if all links are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Booking')).toBeInTheDocument();
    expect(screen.getByText('Peak Season')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  test('opens and closes Contact Modal when Contact Us button is clicked', () => {
    render(<Footer />);
    // Initially, Contact Modal should not be rendered
    expect(screen.queryByText('Contact Us Modal')).not.toBeInTheDocument();
    // Trigger the function to open the modal
    const contactUsButton = screen.getByRole('button', { name: /Contact Us/ });
    fireEvent.click(contactUsButton);
    // After click, Contact Modal should be rendered
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    // Trigger the function to close the modal
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    // After click, Contact Modal should not be rendered
    expect(screen.queryByText('Contact Us')).not.toBeInTheDocument();
  });

  test('shows Contact Modal when "Contact Us" button is clicked', () => {
    render(<Footer />);
    // Initially, Contact Modal should not be rendered
    expect(screen.queryByText('Contact Us Modal')).not.toBeInTheDocument();
    // Trigger the function to show the modal
    const contactUsButton = screen.getByRole('button', { name: /Contact Us/ });
    fireEvent.click(contactUsButton);
    // After click, Contact Modal should be rendered
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('closes Contact Modal when handleCloseContactModal is called', () => {
    render(<Footer />);
    // Initially, Contact Modal should not be rendered
    expect(screen.queryByText('Contact Us')).not.toBeInTheDocument();
    
    // Open the Contact Modal
    const contactUsButton = screen.getByRole('button', { name: /Contact Us/ });
    fireEvent.click(contactUsButton);
    
    // Verify that the Contact Modal is open
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  
    // Close the Contact Modal
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    
    // Verify that the Contact Modal is closed
    expect(screen.queryByText('Contact Us')).not.toBeInTheDocument();
  });  
});
