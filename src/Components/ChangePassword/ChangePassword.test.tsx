import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Change from './ChangePassword'
import '@testing-library/jest-dom';


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));

jest.mock('../Login/fraxioned.png', () => 'logo');

// Mock the axios module
jest.mock('axios')

//APiurl mock
jest.mock('../../Components/config', () => ({
    ApiUrl: 'http://mock-api-url.com',
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

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


    // Reseting of all the mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders Change component with valid token', () => {
        renderWithRouter(<Change />, { route: '/?token=validtoken' });

        expect(screen.getByAltText('Fraxioned Logo')).toBeInTheDocument();
        expect(screen.getByText('Change password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm New Password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    });

    test('displays error message with invalid token', () => {
        renderWithRouter(<Change />, { route: '/' });
        expect(screen.getAllByText('Invalid reset link. Please request a new passwowrd reset link.')).toBeInTheDocument();
    });

    test('shows error when new password is empty', async () => {
        renderWithRouter(<Change />, { route: '/?token=validtoken' });
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Please enter a new password')).toBeInTheDocument();
        });
    });

    test('shows error when confirm password is empty', async () => {
        renderWithRouter(<Change />, { route: '/?token=validtoken' });

        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Please confirm your new password')).toBeInTheDocument();
        });
    });

    test('shows error when passwords do not match', async () => {
        renderWithRouter(<Change />, { route: '/?token=validtoken' });

        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'differentpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
        });
    });

    test('submits form successfully', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: 'success' });
        renderWithRouter(<Change />, { route: '/?token=validtoken' });

        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'newpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.stringContaining('/authentication/recover/password'),
                { resetToken: 'validtoken', newPassword: 'newpassword' }
            );
        });
    });

    test('shows error message on API failure', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
        renderWithRouter(<Change />, { route: '/?token=validtoken' });

        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'newpassword' } });
        fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

        await waitFor(() => {
            expect(screen.getByText('Failed to change password. Please try again.')).toBeInTheDocument();
        });
    });
});
