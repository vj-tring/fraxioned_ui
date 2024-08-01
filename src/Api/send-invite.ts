import axios from 'axios'
import { ApiUrl } from '../Components/config'
import { SendInvite } from '../Components/Types/Send-invite'

export const sendInvite = async (payload: SendInvite) => {
  try {
    const response = await axios.post(
      `${ApiUrl}/v1/authentication/invite`,
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
