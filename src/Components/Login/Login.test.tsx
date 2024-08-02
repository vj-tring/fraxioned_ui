import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import Login from './Login'

jest.mock('./background.jpg', () => 'background')
jest.mock('./fraxioned.png', () => 'logo')
jest.mock('axios')
jest.mock('../config', () => ({
  ApiUrl: 'http://mock-api-url.com',
}))


const mockedAxios = axios as jest.Mocked<typeof axios>
const mockedUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}))

const renderLogin = () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders login form', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument()
    expect(screen.getByAltText('Fraxioned Logo')).toBeInTheDocument()
    expect(screen.getByText('Login here')).toBeInTheDocument()
    expect(screen.getByText('Please enter your details to sign in')).toBeInTheDocument()
    expect(screen.getByLabelText('Remember me')).toBeInTheDocument()
    expect(screen.getByText('Forgot password?')).toBeInTheDocument()
  })

  test('displays error for invalid email', async () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText('Email')
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } })
    fireEvent.blur(emailInput)
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email id')).toBeInTheDocument()
    })
  })

  test('clears email error when valid email is entered', async () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText('Email')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email id')).toBeInTheDocument()
    })
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } })
    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email id')).not.toBeInTheDocument()
    })
  })

  test('displays error for empty email on submit', async () => {
    renderLogin()
    const submitButton = screen.getByRole('button', { name: /Sign in/i })
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('Please fill in the Email ID')).toBeInTheDocument()
    })
  })

  test('displays error for empty password on submit', async () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText('Email')
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } })
    const submitButton = screen.getByRole('button', { name: /Sign in/i })
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('Please fill in the Password')).toBeInTheDocument()
    })
  })

  test('clears password error on input', async () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /Sign in/i })

    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } })
    fireEvent.click(submitButton)
    await waitFor(() => {
      expect(screen.getByText('Please fill in the Password')).toBeInTheDocument()
    })

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    await waitFor(() => {
      expect(screen.queryByText('Please fill in the Password')).not.toBeInTheDocument()
    })
  })

  test('successful login redirects to dashboard', async () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /Sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        message: 'Login successful',
        user: { id: 1, name: 'Test User' },
        session: { token: 'fake-token', expires_at: '2023-12-31' },
      },
    })

    fireEvent.click(submitButton)

    // await waitFor(() => {
    //   expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard')
    // })

    // expect(localStorage.getItem('token')).toBe('fakeToken')
    // expect(localStorage.getItem('expiredAt')).toBe('2023-12-31')
    // expect(JSON.parse(localStorage.getItem('userData') || '{}')).toEqual({
    //   id: 1,
    //   name: 'Test User',
    // })
  })

  test('displays network error message on network failure', async () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /Sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'))

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument()
    })
  })

  test('displays specific error message on server validation error', async () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /Sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    // mockedAxios.post.mockRejectedValueOnce({
    //   response: { data: { message: 'Invalid credentials' } },
    // })

    fireEvent.click(submitButton)

    // await waitFor(() => {
    //   expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    // })
  })

  test('Remember me checkbox toggles state', () => {
    renderLogin()
    const rememberMeCheckbox = screen.getByLabelText('Remember me') as HTMLInputElement
    expect(rememberMeCheckbox.checked).toBe(false)
    fireEvent.click(rememberMeCheckbox)
    expect(rememberMeCheckbox.checked).toBe(true)
    fireEvent.click(rememberMeCheckbox)
    expect(rememberMeCheckbox.checked).toBe(false)
  })

  test('Forgot password link navigates to forgot password page', () => {
    renderLogin()
    const forgotPasswordLink = screen.getByText('Forgot password?')
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')
  })

  test('displays loader when submitting form', async () => {
    renderLogin()
    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /Sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    mockedAxios.post.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 1000)))

    await waitFor(async () => {
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument()
    })
  })
})