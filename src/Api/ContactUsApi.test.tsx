// __tests__/contactApi.test.ts
import axios from 'axios';
import { sendContactMessage } from "../Api/ContactUsApi";
import { ContactMessagePayload } from '../../src/Components/Types/contact';

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: 'mock response' })),
}));

describe('sendContactMessage', () => {
  it('should send a POST request to the correct URL with the payload', async () => {
    const payload: ContactMessagePayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      message: 'Hello, world!',
    };

    const response = await sendContactMessage(payload);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/contact-us', payload);
    expect(response).toBe('mock response');
  });

  it('should throw an error if the request fails', async () => {
    const payload: ContactMessagePayload = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      message: 'Hello, world!',
    };

    (axios.post as jest.Mock).mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    await expect(sendContactMessage(payload)).rejects.toThrowError('Network error');
  });
});