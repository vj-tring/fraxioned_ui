// CustomNavbar.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import CustomNavbar from './Navbar';

describe('CustomNavbar', () => {
  const logo = 'logo.png';
  const links = [
    { name: 'Home', href: '/home' },
    { name: 'Profile', href: '/profile' },
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

    expect(screen.getByText('Send Invite')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close/i }));

    await waitFor(() => {
      expect(screen.queryByText('Send Invite')).not.toBeInTheDocument();
    });
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

  test('handles logout action and redirects to login', async () => {
    render(
      <Router>
        <CustomNavbar logo={logo} links={links} userName={userName} />
      </Router>
    );

    fireEvent.click(screen.getByText(userName));
    fireEvent.click(screen.getByText('Logout'));

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(screen.getByText('User logged out')).toBeInTheDocument();
    });

    expect(window.location.pathname).toBe('/login');
  });
});