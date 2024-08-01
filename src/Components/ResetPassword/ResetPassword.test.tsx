import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ResetPassword from './ResetPassword'
import '@testing-library/jest-dom'
import axios from 'axios'
import { BrowserRouter } from 'react-router-dom'

jest.mock('../Login/fraxioned.png', () => 'logo')
jest.mock('axios')
jest.mock('../config', () => ({
  ApiUrl: 'http://mock-api-url.com',
}))

const mockedAxios = axios as jest.Mocked<typeof axios>
const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('ResetPassword Component', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('userData', JSON.stringify({ id: 1 }))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ResetPassword onClose={mockOnClose} />
      </BrowserRouter>
    )

  test('renders ResetPassword component', () => {
    renderComponent()

    expect(screen.getByPlaceholderText('Old Password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Confirm New Password')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument()
  })

  test('displays error messages for empty fields', async () => {
    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

    await waitFor(() => {
      expect(
        screen.getByText('Please enter your old password')
      ).toBeInTheDocument()
    })
  })

  test('displays error message for password mismatch', async () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('Old Password'), {
      target: { value: 'oldpass' },
    })
    fireEvent.change(screen.getByPlaceholderText('New Password'), {
      target: { value: 'newpass' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
      target: { value: 'mismatch' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

    await waitFor(() => {
      expect(screen.getByText('New passwords do not match')).toBeInTheDocument()
    })
  })

  test('calls API and displays success message on successful password reset', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: {} })

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText('Old Password'), {
      target: { value: 'oldpass' },
    })
    fireEvent.change(screen.getByPlaceholderText('New Password'), {
      target: { value: 'newpass' },
    })
    fireEvent.change(screen.getByPlaceholderText('Confirm New Password'), {
      target: { value: 'newpass' },
    })

    fireEvent.click(screen.getByRole('button', { name: /Submit/i }))

    await waitFor(() => {
      expect(
        screen.getByText('Password reset successfully!')
      ).toBeInTheDocument()
    })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/authentication/resetPassword'),
      expect.objectContaining({
        oldPassword: 'oldpass',
        newPassword: 'newpass',
        userId: 1,
      })
    )
  })

  test('calls onClose when close icon is clicked', () => {
    renderComponent()

    fireEvent.click(screen.getByTestId('close-icon'))

    expect(mockOnClose).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })
})
