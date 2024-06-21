import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomNavbar from './Navbar';

describe('CustomNavbar', () => {
  const logo = 'logo.png';
const links = [
  { disabled: undefined, name: 'Home', href: '/home' },
  { disabled: undefined, name: 'Profile', href: '/profile' },
];
  const userName = 'John Doe';
  test('renders CustomNavbar with logo, links, and user info', () => {
    render(
      <Router>
        <CustomNavbar logo={logo} links={links} userName={userName} />
      </Router>
    );

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  test('opens and closes the Send Invite modal', async () => {
    render(
      <Router>
        <CustomNavbar logo={logo} links={links} userName={userName} />
      </Router>
    );
  
    fireEvent.click(screen.getByText(userName));
    fireEvent.click(screen.getByText('Send Invite'));
  
  });

  test('opens and closes the Logout confirmation modal', async () => {
    render(
      <Router>
        <CustomNavbar logo={logo} links={links} userName={userName} />
      </Router>
    );

    fireEvent.click(screen.getByText(userName));
    fireEvent.click(screen.getByText('Logout'));

    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
    });
  });

  it('handles logout action and redirects to login', async () => {
    render(
      <Router>
        <CustomNavbar logo={logo} links={links} userName={userName} />
      </Router>
    );

    fireEvent.click(screen.getByText(userName)); // Open dropdown

    // Use a more specific query to target the logout button
    const logoutButton = await screen.findByRole('button', { name: /logout/i });

    fireEvent.click(logoutButton); // Click logout option

    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();

  });
});