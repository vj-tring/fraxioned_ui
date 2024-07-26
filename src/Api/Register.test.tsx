// register.api.test.js
import axios from 'axios'
import { registerUser } from './Register'
import { ApiUrl } from '../Components/config'

jest.mock('axios')

describe('registerUser API', () => {
  it('calls the correct endpoint with the correct payload', async () => {
    const payload = {
      username: 'username',
      email: 'email@example.com',
      password: 'password',
    }

    const response = {
      data: {
        message: 'User registered successfully',
      },
    }

    ;(axios.post as jest.Mock).mockResolvedValue(response)

    await registerUser(payload)

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith(
      `${ApiUrl}/authentication/register`,
      payload
    )
  })

  it('returns the response from the API', async () => {
    const payload = {
      username: 'username',
      email: 'email@example.com',
      password: 'password',
    }

    const response = {
      data: {
        message: 'User registered successfully',
      },
    }

    ;(axios.post as jest.Mock).mockResolvedValue(response)

    const result = await registerUser(payload)

    expect(result).toEqual(response)
  })

  it('throws an error if the API call fails', async () => {
    const payload = {
      username: 'username',
      email: 'email@example.com',
      password: 'password',
    }

    const error = new Error('API call failed')

    ;(axios.post as jest.Mock).mockRejectedValue(error)

    await expect(registerUser(payload)).rejects.toThrowError(error)
  })
})
