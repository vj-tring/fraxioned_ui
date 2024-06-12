import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import SendInvite from './SendInvite';
import '@testing-library/jest-dom';
import axios from 'axios';
import useSendInviteHandler from './SendInviteApiHandler';



jest.mock('axios');
jest.mock('./SendInviteApiHandler');

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

    axios.get = jest.fn().mockResolvedValue({
      data: [
        { id: 1, roleName: 'Admin' },
        { id: 2, roleName: 'User' },
      ],
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
    
    await screen.findByText('Admin');
    await screen.findByText('User');
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

  test('calls setSelectedRole on role select change', async () => {
    const mockSetSelectedRole = jest.fn();
    mockedUseSendInviteHandler.mockReturnValueOnce({
      ...mockedUseSendInviteHandler(),
      setSelectedRole: mockSetSelectedRole,
    });

    render(<SendInvite />);

    await screen.findByText('Admin');

    fireEvent.change(screen.getByText('Select role'), {
      target: { value: '1' },
    });

    expect(mockSetSelectedRole).toHaveBeenCalledWith(1);
  });

  test('displays loading spinner when status is loading', () => {
    mockedUseSendInviteHandler.mockReturnValueOnce({
      ...mockedUseSendInviteHandler(),
      status: 'loading',
    });

    render(<SendInvite />);

    expect(screen.getByRole('button', { name: /Send Invite/i })).toBeDisabled();
    expect(screen.getByRole('status')).toBeInTheDocument();
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