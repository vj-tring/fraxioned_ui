import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'
import Login from './Login'

jest.mock('./background.jpg', () => 'background')
jest.mock('./fraxioned.png', () => 'logo')
jest.mock('axios')
jest.mock('../../Components/config', () => ({
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
  })

  // test('displays error for invalid email', () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   fireEvent.change(emailInput, { target: { value: 'invalidemail' } })
  //   fireEvent.blur(emailInput)
  //   expect(screen.getByText('Please enter a valid email id')).toBeInTheDocument()
  // })

  // test('clears email error when valid email is entered', () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
  //   fireEvent.blur(emailInput)
  //   expect(screen.getByText('Please enter a valid email id')).toBeInTheDocument()
  //   fireEvent.change(emailInput, { target: { value: 'valid@email.com' } })
  //   expect(screen.queryByText('Please enter a valid email id')).not.toBeInTheDocument()
  // })

  // test('submit button is enabled only when both fields are valid', () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   const passwordInput = screen.getByPlaceholderText('Password')
  //   const submitButton = screen.getByRole('button', { name: /Sign in/i })

  //   // Initially, the button should be enabled
  //   expect(submitButton).not.toBeDisabled()

  //   fireEvent.change(emailInput, { target: { value: 'valid@email.com' } })
  //   fireEvent.change(passwordInput, { target: { value: 'password123' } })

  //   expect(submitButton).not.toBeDisabled()
  // })

  // test('initial state is correct', () => {
  //   renderLogin()
  //   expect(screen.getByPlaceholderText('Email')).toHaveValue('')
  //   expect(screen.getByPlaceholderText('Password')).toHaveValue('')
  //   expect(screen.queryByText('Please fill in the Email ID')).not.toBeInTheDocument()
  //   expect(screen.queryByText('Please fill in the Password')).not.toBeInTheDocument()
  //   expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument()
  // })

  // test('handleEmailChange updates the email state', () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
  //   expect(emailInput).toHaveValue('test@example.com')
  // })

  // test('handlePasswordChange updates the password state', () => {
  //   renderLogin()
  //   const passwordInput = screen.getByPlaceholderText('Password')
  //   fireEvent.change(passwordInput, { target: { value: 'password123' } })
  //   expect(passwordInput).toHaveValue('password123')
  // })

  // test('displays error for empty email', () => {
  //   renderLogin()
  //   const submitButton = screen.getByRole('button', { name: /Sign in/i })
  //   fireEvent.click(submitButton)
  //   expect(screen.getByText('Please fill in the Email ID')).toBeInTheDocument()
  // })

  // test('displays error for empty password', () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   fireEvent.change(emailInput, { target: { value: 'valid@email.com' } })
  //   const submitButton = screen.getByRole('button', { name: /Sign in/i })
  //   fireEvent.click(submitButton)
  //   expect(screen.getByText('Please fill in the Password')).toBeInTheDocument()
  // })

  // test('clears password error on input', () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   const passwordInput = screen.getByPlaceholderText('Password')
  //   const submitButton = screen.getByRole('button', { name: /Sign in/i })

  //   fireEvent.change(emailInput, { target: { value: 'valid@email.com' } })
  //   fireEvent.click(submitButton)
  //   expect(screen.getByText('Please fill in the Password')).toBeInTheDocument()

  //   fireEvent.change(passwordInput, { target: { value: 'password123' } })
  //   expect(screen.queryByText('Please fill in the Password')).not.toBeInTheDocument()
  // })

  // test('successful login redirects to dashboard', async () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   const passwordInput = screen.getByPlaceholderText('Password')
  //   const submitButton = screen.getByRole('button', { name: /Sign in/i })

  //   fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
  //   fireEvent.change(passwordInput, { target: { value: 'password123' } })

  //   mockedAxios.post.mockResolvedValueOnce({
  //     data: {
  //       user: { id: 1, name: 'Test User' },
  //       session: { token: 'fake-token', expires_at: '2023-12-31' },
  //     },
  //   })

  //   fireEvent.click(submitButton)

  //   await waitFor(() => {
  //     expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard')
  //   })

  //   expect(localStorage.getItem('token')).toBe('fake-token')
  //   expect(localStorage.getItem('expiredAt')).toBe('2023-12-31')
  //   expect(JSON.parse(localStorage.getItem('userData') || '{}')).toEqual({
  //     id: 1,
  //     name: 'Test User',
  //   })
  // })

  // test('handles email blur with empty input', () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   fireEvent.blur(emailInput)
  //   expect(screen.queryByText('Please enter a valid email id')).not.toBeInTheDocument()
  // })

  // test('displays network error message on network failure', async () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   const passwordInput = screen.getByPlaceholderText('Password')
  //   const submitButton = screen.getByRole('button', { name: /Sign in/i })

  //   fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
  //   fireEvent.change(passwordInput, { target: { value: 'password123' } })

  //   mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'))

  //   fireEvent.click(submitButton)

  //   await waitFor(() => {
  //     expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument()
  //   })
  // })

  // test('displays specific error message on server validation error', async () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   const passwordInput = screen.getByPlaceholderText('Password')
  //   const submitButton = screen.getByRole('button', { name: /Sign in/i })

  //   fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
  //   fireEvent.change(passwordInput, { target: { value: 'password123' } })

  //   mockedAxios.post.mockRejectedValueOnce({
  //     response: { data: { message: 'Invalid credentials' } },
  //   })

  //   fireEvent.click(submitButton)

  //   await waitFor(() => {
  //     expect(screen.getByText('Login failed')).toBeInTheDocument()
  //   })
  // })

  // test('Remember me checkbox toggles state', () => {
  //   renderLogin()
  //   const rememberMeCheckbox = screen.getByLabelText('Remember me') as HTMLInputElement
  //   expect(rememberMeCheckbox.checked).toBe(false)
  //   fireEvent.click(rememberMeCheckbox)
  //   expect(rememberMeCheckbox.checked).toBe(true)
  //   fireEvent.click(rememberMeCheckbox)
  //   expect(rememberMeCheckbox.checked).toBe(false)
  // })

  // test('displays generic error message on network failure', async () => {
  //   renderLogin()
  //   const emailInput = screen.getByPlaceholderText('Email')
  //   const passwordInput = screen.getByPlaceholderText('Password')
  //   const submitButton = screen.getByRole('button', { name: /Sign in/i })

  //   fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
  //   fireEvent.change(passwordInput, { target: { value: 'password123' } })

  //   mockedAxios.post.mockRejectedValueOnce(new Error('Network Error'))

  //   fireEvent.click(submitButton)

  //   await waitFor(() => {
  //     expect(screen.getByText('An error occurred. Please try again.')).toBeInTheDocument()
  //   })
  // })
})
