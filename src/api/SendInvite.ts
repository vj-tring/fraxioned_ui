import axios from 'axios'
import { SendInvite } from '../model/Send-Invite'
import { ApiUrl } from '../config/config'

export const sendInvite = async (payload: SendInvite) => {
  try {
    const response = await axios.post(
      `${ApiUrl}/authentication/invite`,
      payload
    )
    return response
  } catch (error) {
    throw error
  }
}
