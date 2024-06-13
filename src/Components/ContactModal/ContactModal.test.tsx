import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import ContactModal from './ContactModal';

describe('ContactModal', () => {
  it('renders correctly', () => {
    const show = true;
    const handleClose = jest.fn();
    render(<ContactModal show={show} handleClose={handleClose} />);

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('calls handleClose when close button is clicked', () => {
    const show = true;
    const handleClose = jest.fn();
    render(<ContactModal show={show} handleClose={handleClose} />);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders Contact component', () => {
    const show = true;
    const handleClose = jest.fn();
    render(<ContactModal show={show} handleClose={handleClose} />);

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    // You can also test the Contact component itself here
  });

  it('does not render when show is false', () => {
    const show = false;
    const handleClose = jest.fn();
    render(<ContactModal show={show} handleClose={handleClose} />);

    expect(screen.queryByText('Contact Us')).not.toBeInTheDocument();
  });
});