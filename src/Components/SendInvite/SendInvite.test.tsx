import React from 'react';

import { render, screen, fireEvent} from '@testing-library/react';
import SendInvite from './SendInvite';
import '@testing-library/jest-dom';
// import axios from 'axios';
import useSendInviteHandler from './SendInviteFunction';

jest.mock('axios');
jest.mock('./SendInviteFunction');

const mockedUseSendInviteHandler = useSendInviteHandler as jest.MockedFunction<typeof useSendInviteHandler>;

describe('SendInvite Component', () => {
  beforeEach(() => {
    mockedUseSendInviteHandler.mockReturnValue({
      handleSubmit: jest.fn(),
      email: '',
      status: 'idle',
      errorMessage: '',
      setEmail: jest.fn(),
      selectedRole: '',
      setSelectedRole: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders SendInvite component', async () => {
    render(<SendInvite />);

    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByText('Select role')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Invite/i })).toBeInTheDocument();
  });

  test('calls setEmail on email input change', () => {
    const mockSetEmail = jest.fn();
    mockedUseSendInviteHandler.mockReturnValueOnce({
      ...mockedUseSendInviteHandler(),
      setEmail: mockSetEmail,
    });

    render(<SendInvite />);

    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
      target: { value: 'test@example.com' },
    });

    expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
  });
  
  test('displays loading spinner when status is loading', () => {
    mockedUseSendInviteHandler.mockReturnValueOnce({
      ...mockedUseSendInviteHandler(),
      status: 'loading',
    });
  });

  test('displays success message when status is success', () => {
    mockedUseSendInviteHandler.mockReturnValueOnce({
      ...mockedUseSendInviteHandler(),
      status: 'success',
    });

    render(<SendInvite />);

    expect(screen.getByText('Invite sent successfully!')).toBeInTheDocument();
  });

  test('displays error message when status is error', () => {
    mockedUseSendInviteHandler.mockReturnValueOnce({
      ...mockedUseSendInviteHandler(),
      status: 'error',
      errorMessage: 'Error sending invite',
    });

    render(<SendInvite />);

    expect(screen.getByText('Error sending invite')).toBeInTheDocument();
  });

  test('calls handleSubmit on form submission', () => {
    const mockHandleSubmit = jest.fn();
    mockedUseSendInviteHandler.mockReturnValueOnce({
      ...mockedUseSendInviteHandler(),
      handleSubmit: mockHandleSubmit,
    });

    render(<SendInvite />);

    fireEvent.submit(screen.getByRole('button', { name: /Send Invite/i }));

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});

