// logout.api.test.js
import axios from 'axios';
// import { logout } from './Logout';
// import { ApiUrl } from "../Components/config";

// jest.mock('axios');

// describe('logout API', () => {
//   it('calls the correct endpoint', async () => {
//     const response = {
//       data: {
//         message: 'Logged out successfully',
//       },
//     };

//     (axios.post as jest.Mock).mockResolvedValue(response);

//     await logout();

//     expect(axios.post).toHaveBeenCalledTimes(1);
//     expect(axios.post).toHaveBeenCalledWith(`${ApiUrl}/authentication/logout`);
//   });

//   it('returns the response from the API', async () => {
//     const response = {
//       data: {
//         message: 'Logged out successfully',
//       },
//     };

//     (axios.post as jest.Mock).mockResolvedValue(response);

//     const result = await logout();

//     expect(result).toEqual(response);
//   });

//   it('throws an error if the API call fails', async () => {
//     const error = new Error('API call failed');

//     (axios.post as jest.Mock).mockRejectedValue(error);

//     await expect(logout()).rejects.toThrowError(error);
//   });
// });