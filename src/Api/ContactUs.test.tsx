// __tests__/contactApi.test.ts
import axios from 'axios'
import { sendContactMessage } from './ContactUs'
import { ContactMessage } from 'Components/Types/contact'

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: 'mock response' })),
}))

describe('sendContactMessage', () => {
  // it('should send a POST request to the correct URL with the payload', async () => {
  //   const payload: ContactMessagePayload = {
  //     userId:1,
  //     name: 'John Doe',
  //     email: 'johndoe@example.com',
  //     message: 'Hello, world!',
  //   };

  //   const response = await sendContactMessage(payload);

  //   expect(axios.post).toHaveBeenCalledTimes(1);
  //   expect(response).toBe('mock response');
  // });

  it('should throw an error if the request fails', async () => {
    const payload: ContactMessage = {
      userId: 1,

      subject: 'sdfs',
      name: 'John Doe',
      email: 'johndoe@example.com',
      message: 'Hello, world!',
    }

    ;(axios.post as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    )

    await expect(sendContactMessage(payload)).rejects.toThrowError(
      'Network error'
    )
  })
})
