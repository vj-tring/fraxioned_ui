import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Dashboard from './Dashboard1';

describe('Dashboard', () => {
  it('renders correctly', () => {
    render(<Dashboard />);
    expect(screen.getByText('Fraxioned')).toBeInTheDocument();
    expect(screen.getByText('HOME')).toBeInTheDocument();
    expect(screen.getByText('BOOKING')).toBeInTheDocument();
    expect(screen.getByText('PEAK SEASON')).toBeInTheDocument();
    expect(screen.getByText('PAYEMENTS')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  it('renders user email', () => {
    const userEmail = 'user@example.com';
    localStorage.setItem('userData', JSON.stringify({ email: userEmail }));
    render(<Dashboard />);
    expect(screen.getByText(userEmail)).toBeInTheDocument();
  });

  it('renders ContactModal when show is true', () => {
    render(<Dashboard />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  it('calls handleClose when close button is clicked', () => {
    render(<Dashboard />);
    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);
    expect(closeButton).not.toBeInTheDocument();
  });

  it('renders Home component', () => {
    render(<Dashboard />);
    expect(screen.getByText('Welcome to Home')).toBeInTheDocument();
  });

  it('renders Footer component', () => {
    render(<Dashboard />);
    expect(screen.getByText('Copyright 2023 Fraxioned')).toBeInTheDocument();
  });
});