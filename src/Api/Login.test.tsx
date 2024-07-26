// login.api.test.js
import axios from 'axios'
import { login } from './Login'
import { ApiUrl } from '../Components/config'
import { Login } from '../Components/Types/Login'

jest.mock('axios')

describe('login API', () => {
  it('calls the correct endpoint with the correct payload', async () => {
    const payload: Login = {
      email: 'email',
      password: 'password',
    }

    const response = {
      data: {
        token: 'token',
      },
    }

    ;(axios.post as jest.Mock).mockResolvedValue(response)

    await login(payload)

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith(
      `${ApiUrl}/authentication/login`,
      payload
    )
  })

  it('returns the response from the API', async () => {
    const payload: Login = {
      email: 'email',
      password: 'password',
    }

    const response = {
      data: {
        token: 'token',
      },
    }

    ;(axios.post as jest.Mock).mockResolvedValue(response)

    const result = await login(payload)

    expect(result).toEqual(response)
  })

  it('throws an error if the API call fails', async () => {
    const payload: Login = {
      email: 'email',
      password: 'password',
    }

    const error = new Error('API call failed')

    ;(axios.post as jest.Mock).mockRejectedValue(error)

    await expect(login(payload)).rejects.toThrowError(error)
  })
})
