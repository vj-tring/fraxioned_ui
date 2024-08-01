import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import axios from 'axios'
import ForgetPassword from './ForgotPassword'
import '@testing-library/jest-dom'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

//image mock
jest.mock('../Login/background.jpg', () => 'background')
jest.mock('../Login/fraxioned.png', () => 'logo')

// Mock the axios module
jest.mock('axios')

//APiurl mock
jest.mock('../../Components/config', () => ({
  ApiUrl: 'http://mock-api-url.com',
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('ForgetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders ForgetPassword component', () => {
    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    )

    expect(screen.getByText('Forget password')).toBeInTheDocument()
    expect(screen.getByText('Recover your password here')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    expect(screen.getByText('Remember password?')).toBeInTheDocument()
    expect(screen.getByText('Login here!')).toBeInTheDocument()
  })

  test('displays error message for empty email', async () => {
    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))
    expect(
      await screen.findByText('Please fill in the Email ID')
    ).toBeInTheDocument()
  })

  test('displays error message for invalid email', async () => {
    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'invalid-email' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(
      await screen.findByText('Please enter a valid email ID')
    ).toBeInTheDocument()
  })

  test('submits form with valid email', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: 'Success' })

    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/authentication/forgotPassword'),
        { email: 'test@example.com' }
      )
    })
  })

  test('displays loading state while submitting', async () => {
    mockedAxios.post.mockImplementationOnce(() => new Promise(() => { }))

    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(await screen.findByText('Submitting...')).toBeInTheDocument()
  })

  test('displays error message on API failure', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API Error'))

    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    expect(
      await screen.findByText(
        'Failed to request password reset. Please try again.'
      )
    ).toBeInTheDocument()
  })

  test('clears error message on valid email input', async () => {
    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'invalid-email' },
    })
    fireEvent.blur(screen.getByPlaceholderText('Email'))

    expect(
      await screen.findByText('Please enter a valid email ID')
    ).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'valid@email.com' },
    })

    expect(
      screen.queryByText('Please enter a valid email ID')
    ).not.toBeInTheDocument()
  })
})
