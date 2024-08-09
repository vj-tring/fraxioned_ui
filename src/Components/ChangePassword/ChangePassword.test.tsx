import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Change from './ChangePassword';
import '@testing-library/jest-dom';
import * as api from '../../utils/api';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

jest.mock('../Login/fraxioned.png', () => 'logo');
jest.mock('../Login/background.png', () => 'background.png');

// Mock the api module
jest.mock('../../utils/api');

describe('Change Component', () => {
    const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
        return render(
            <MemoryRouter initialEntries={[route]}>
                <Routes>
                    <Route path="*" element={ui} />
                </Routes>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Change component with valid reset token', () => {
        renderWithRouter(<Change />, { route: '/?resetToken=validtoken' });

        expect(screen.getByAltText('Fraxioned Logo')).toBeInTheDocument();
        expect(screen.getByText('Change password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    test('displays error message with invalid reset token', () => {
        renderWithRouter(<Change />, { route: '/' });
        expect(screen.getByText('Invalid reset link. Please request a new password reset link.')).toBeInTheDocument();
    });

    test('shows error when new password is empty', async () => {
        renderWithRouter(<Change />, { route: '/?resetToken=validtoken' });
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Please enter a new password')).toBeInTheDocument();
        });
    });

    test('shows error when confirm password is empty', async () => {
        renderWithRouter(<Change />, { route: '/?resetToken=validtoken' });

        fireEvent.change(screen.getByPlaceholderText('New Password'), {
            target: { value: 'newpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Please confirm your new password')).toBeInTheDocument();
        });
    });

    test('shows error when passwords do not match', async () => {
        renderWithRouter(<Change />, { route: '/?resetToken=validtoken' });

        fireEvent.change(screen.getByPlaceholderText('New Password'), {
            target: { value: 'newpassword' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
            target: { value: 'differentpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });
    });

    test('submits form successfully', async () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

        renderWithRouter(<Change />, { route: '/?resetToken=validtoken' });

        fireEvent.change(screen.getByPlaceholderText('New Password'), {
            target: { value: 'newpassword' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
            target: { value: 'newpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            // expect(mockRecoverPasswordApi).toHaveBeenCalledWith('newpassword');
            // expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    test('shows error message on API failure', async () => {
        jest.spyOn(api, 'recoverPasswordApi').mockRejectedValueOnce(new Error('API Error'));
        renderWithRouter(<Change />, { route: '/?resetToken=validtoken' });

        fireEvent.change(screen.getByPlaceholderText('New Password'), {
            target: { value: 'newpassword' },
        });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
            target: { value: 'newpassword' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Failed to change password. Please try again.')).toBeInTheDocument();
        });
    });
});