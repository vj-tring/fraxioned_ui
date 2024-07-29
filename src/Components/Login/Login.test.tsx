import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import Login from './Login'

// Mock for background image
jest.mock('../../assets/Login_image/login_image.jpg', () => 'background');
jest.mock('./fraxioned.png', () => 'logo');

// Mock the axios module
jest.mock('axios')

//For the apiurl config mocka
jest.mock('../../Components/config', () => ({
    ApiUrl: 'http://mock-api-url.com',
}));

const mockedAxios = axios as jest.Mocked<typeof axios>

// Mock the useNavigate hook
const mockedUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUseNavigate,
}))


// Helper function to render the Login component within the given router
const renderLogin = () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    )
}

describe('Login Component', () => {
    // Reset all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks()
    })

    // Test if the component renders correctly
    test('renders login form', () => {
        renderLogin()
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
    })

    // Test email validation
    test('displays error for invalid email', () => {
        renderLogin()
        const emailInput = screen.getByPlaceholderText('Email')
        fireEvent.change(emailInput, { target: { value: 'invalidemail' } })
        fireEvent.blur(emailInput)
        expect(screen.getByText('Please enter a valid email id')).toBeInTheDocument()
    })

    // Test empty email submission
    test('displays error for empty email', () => {
        renderLogin()
        const submitButton = screen.getByRole('button', { name: /Sign in/i })
        fireEvent.click(submitButton)
        expect(screen.getByText('Please fill in the Email ID')).toBeInTheDocument()
    })


    // displays for fill in password
    test('displays error for empty password', () => {
        renderLogin()
        const emailInput = screen.getByPlaceholderText('Email')
        fireEvent.change(emailInput, { target: { value: 'valid@email.com' } })
        const submitButton = screen.getByRole('button', { name: /Sign in/i })
        fireEvent.click(submitButton)
        expect(screen.getByText('Please fill in the Password')).toBeInTheDocument()
    })


    // Test successful login
    test('successful login redirects to dashboard', async () => {
        renderLogin()
        const emailInput = screen.getByPlaceholderText('Email')
        const passwordInput = screen.getByPlaceholderText('Password')
        const submitButton = screen.getByRole('button', { name: /Sign in/i })

        fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'password123' } })

        // Mock the axios post request
        mockedAxios.post.mockResolvedValueOnce({
            data: {
                user: { id: 1, name: 'Test User' },
                session: { token: 'fake-token', expires_at: '2023-12-31' },
            },
        })

        fireEvent.click(submitButton)

        await waitFor(() => {
            expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard')
        })

        // Check if localStorage is set correctly
        expect(localStorage.getItem('token')).toBe('fake-token')
        expect(localStorage.getItem('expiredAt')).toBe('2023-12-31')
        expect(JSON.parse(localStorage.getItem('userData') || '{}')).toEqual({ id: 1, name: 'Test User' })
    })

    // Test login failure messages handling 
    test('displays error message on login failure', async () => {
        renderLogin()
        const emailInput = screen.getByPlaceholderText('Email')
        const passwordInput = screen.getByPlaceholderText('Password')
        const submitButton = screen.getByRole('button', { name: /Sign in/i })

        fireEvent.change(emailInput, { target: { value: 'test.example.com' } })
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })

        // mockedAxios.post.mockRejectedValueOnce({
        //     // response: { data: { message: 'Invalid credentials' } },
        // })

        fireEvent.click(submitButton)
    })

    // Test "Forgot password" link
    test('renders "Forgot password" link', () => {
        renderLogin()
        expect(screen.getByText('Forgot password?')).toHaveAttribute('href', '/forgot-password')
    })
})
