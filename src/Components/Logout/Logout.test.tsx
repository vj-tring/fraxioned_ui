import axios from 'axios'
import { logout } from '../Logout/Logout'
import { ApiUrl } from '../config'

jest.mock('axios', () => ({
    post: jest.fn(),
}))

describe('logout', () => {
    it('should make a POST request to the logout endpoint', async () => {
        const response = { data: 'Logged out successfully' }
        ;(axios.post as jest.Mock).mockResolvedValue(response)

        const result = await logout()

        expect(axios.post).toHaveBeenCalledTimes(1)
        expect(axios.post).toHaveBeenCalledWith(
            `${ApiUrl}/authentication/logout`
        )
        expect(result).toEqual(response)
    })

    it('should throw an error if the request fails', async () => {
        const error = new Error('Request failed')
        ;(axios.post as jest.Mock).mockRejectedValue(error)

        await expect(logout()).rejects.toThrowError(error)
    })
})
