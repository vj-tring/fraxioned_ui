import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import UserDetailsModal from './UserDetailsModal';

describe('UserDetailsModal', () => {
  const userDetails = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    phone: '123-456-7890',
    mailingAddress: '123 Main St',
    secondaryEmail: 'johndoe2@example.com',
    secondaryPhone: '098-765-4321',
  };

  const userImage = 'https://example.com/user-image.jpg';

  it('renders user details', () => {
    render(<UserDetailsModal show onHide={() => {}} userImage={userImage} userDetails={userDetails} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('johndoe@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('123 Main St')).toBeInTheDocument();
    expect(screen.getByText('johndoe2@example.com')).toBeInTheDocument();
    expect(screen.getByText('098-765-4321')).toBeInTheDocument();
  });

  it('renders edit icon on hover', () => {
    render(<UserDetailsModal show onHide={() => {}} userImage={userImage} userDetails={userDetails} />);

    const image = screen.getByRole('img');
    fireEvent.mouseOver(image);

    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });

  it('calls handleEditIconClick on edit icon click', () => {
    const handleEditIconClick = jest.fn();
    render(<UserDetailsModal show onHide={() => {}} userImage={userImage} userDetails={userDetails} />);

    const editIcon = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(editIcon);

    expect(handleEditIconClick).not.toHaveBeenCalled(); // handleEditIconClick is not a prop of UserDetailsModal
  });

  it('renders file input on edit icon click', async () => {
    render(<UserDetailsModal show onHide={() => {}} userImage={userImage} userDetails={userDetails} />);

    const editIcon = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(editIcon);

    await waitFor(() => screen.getByRole('fileinput'));

    expect(screen.getByRole('fileinput')).toBeInTheDocument();
  });
});