import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import Login from './Login';

describe('Login Component', () => {
  it('renders the login form', () => {
    render(<Router><Login /></Router>); // Wrap Login component with Router
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('submits the form with valid input', async () => {
    render(<Router><Login /></Router>);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
  
    fireEvent.click(screen.getByText('Submit'));
  
    // Wait for a brief moment to allow the UI to update
    await new Promise(resolve => setTimeout(resolve, 100));
  
    // Check if the success message exists
    const successMessage = screen.queryByText('Login Successful');
    expect(successMessage).toBeInTheDocument();
  });
  
  
});
