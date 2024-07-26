import axios from 'axios'
import { ApiUrl } from '../config'

export const logout = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`${ApiUrl}/authentication/logout`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            // If the error is a response from the server
            return error.response
        }
        throw error
    }
}