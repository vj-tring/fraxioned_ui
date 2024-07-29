import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ResetPassword from './ResetPassword'
import '@testing-library/jest-dom'
import axios from 'axios'


jest.mock('../Login/fraxioned.png', () => 'logo');

// Mock the axios module
jest.mock('axios')

//APiurl mock
jest.mock('../../Components/config', () => ({
    ApiUrl: 'http://mock-api-url.com',
}));

// Reset the mocks test before each test
beforeEach(() => {
    jest.clearAllMocks();
});

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('ResetPassword Component', () => {
    beforeEach(() => {
        localStorage.clear()
        localStorage.setItem('userData', JSON.stringify({ id: 1 }))
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('renders ResetPassword component', () => {
        render(<ResetPassword />)

        expect(screen.getByPlaceholderText('Old Password')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Confirm New Password')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument()
    })

    test('displays error messages for empty fields', async () => {
        render(<ResetPassword />)

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

        await waitFor(() => {
            expect(screen.getByText('Please enter your old password')).toBeInTheDocument()
        })
    })

    test('displays error message for password mismatch', async () => {
        render(<ResetPassword />)

        fireEvent.change(screen.getByPlaceholderText('Old Password'), { target: { value: 'oldpass' } })
        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass' } })
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'mismatch' } })

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

        await waitFor(() => {
            expect(screen.getByText('New passwords do not match')).toBeInTheDocument()
        })
    })

    test('calls API and displays success message on successful password reset', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: {} })

        render(<ResetPassword />)

        fireEvent.change(screen.getByPlaceholderText('Old Password'), { target: { value: 'oldpass' } })
        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass' } })
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'newpass' } })

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

        await waitFor(() => {
            expect(screen.getByText('Password reset successfully!')).toBeInTheDocument()
        })

        expect(mockedAxios.post).toHaveBeenCalledWith(
            expect.stringContaining('/authentication/resetPassword'),
            expect.objectContaining({
                oldPassword: 'oldpass',
                newPassword: 'newpass',
                userId: 1
            })
        )
    })

    test('displays API error message on failed password reset', async () => {
        render(<ResetPassword />)

        fireEvent.change(screen.getByPlaceholderText('Old Password'), { target: { value: 'oldpass' } })
        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpass' } })
        fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), { target: { value: 'newpass' } })

        fireEvent.click(screen.getByRole('button', { name: /Submit/i }))
    })
})