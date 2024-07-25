import { renderHook, act } from '@testing-library/react-hooks'
// import axios, { AxiosResponse, AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom'
// import { useFormik } from 'formik';
import useLoginHandler from './LoginFunction'
// import { login } from '../../Api/LoginApi';

jest.mock('../../Api/Login.ts')
jest.mock('axios')
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}))

const mockedUseNavigate = useNavigate as jest.MockedFunction<typeof useNavigate>

describe('useLoginHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockedUseNavigate.mockReturnValue(jest.fn())
    })

    // test('handles successful login', async () => {
    //   const mockPayload = { email: 'test@example.com', password: 'password123' };
    //   // const mockResponse: AxiosResponse<any> = {
    //   //   data: {
    //   //     user: { id: 1, name: 'Test User' },
    //   //     session: { token: 'mockToken', expiresAt: 'mockExpiresAt' },
    //   //   },
    //   //   status: 201,
    //   //   statusText: 'Created',
    //   //   headers: {},
    //   //   config: {}, // Adjust config as needed
    //   // };

    //   // (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);

    //   const { result } = renderHook(() => useLoginHandler());

    //   // Simulate form submission
    //   await act(async () => {
    //     await result.current.formik.handleSubmit({
    //       preventDefault: jest.fn(),
    //       target: {
    //         elements: {
    //           email: { value: mockPayload.email },
    //           password: { value: mockPayload.password },
    //         },
    //       },
    //     } as unknown as React.FormEvent<HTMLFormElement>);
    //   });

    //   // Assertions for successful login
    //   expect(result.current.openSnackbar).toBe(true);
    //   expect(result.current.snackbarMessage).toBe('Login successful!');
    //   expect(result.current.snackbarSeverity).toBe('success');
    //   // expect(localStorage.getItem('userData')).toBe(JSON.stringify(mockResponse.data.user));
    //   // expect(localStorage.getItem('token')).toBe(mockResponse.data.session.token);
    //   // expect(localStorage.getItem('expiresAt')).toBe(mockResponse.data.session.expiresAt);
    //   expect(mockedUseNavigate).toHaveBeenCalledWith('/dashboard');
    // });

    // test('handles invalid credentials', async () => {
    //   const mockPayload = { email: 'test@example.com', password: 'wrongPassword' };
    //   // const mockError: AxiosError<any> = {
    //   //   message: 'Unauthorized',
    //   //   response: {
    //   //     data: { message: 'Invalid credentials' },
    //   //     status: 401,
    //   //     statusText: 'Unauthorized',
    //   //     headers: {},
    //   //     config: {}, // Adjust config as needed
    //   //   },
    //   //   isAxiosError: true,
    //   //   toJSON: jest.fn(),
    //   // };

    //   // (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

    //   const { result } = renderHook(() => useLoginHandler());

    //   // Simulate form submission
    //   await act(async () => {
    //     await result.current.formik.handleSubmit({
    //       preventDefault: jest.fn(),
    //       target: {
    //         elements: {
    //           email: { value: mockPayload.email },
    //           password: { value: mockPayload.password },
    //         },
    //       },
    //     } as unknown as React.FormEvent<HTMLFormElement>);
    //   });

    //   // Assertions for invalid credentials
    //   expect(result.current.openSnackbar).toBe(true);
    //   expect(result.current.snackbarMessage).toBe('Invalid Credentials!');
    //   expect(result.current.snackbarSeverity).toBe('error');
    //   expect(result.current.formik.values.email).toBe('');
    //   expect(result.current.formik.values.password).toBe('');
    // });

    // test('handles unknown error in login', async () => {
    //   const mockPayload = { email: 'test@example.com', password: 'password123' };
    //   // const mockError: AxiosError<any> = {
    //   //   message: 'Network Error',
    //   //   isAxiosError: true,
    //   //   toJSON: jest.fn(),
    //   // };

    //   // (axios.post as jest.Mock).mockRejectedValueOnce(mockError);

    //   const { result } = renderHook(() => useLoginHandler());

    //   // Simulate form submission
    //   await act(async () => {
    //     await result.current.formik.handleSubmit({
    //       preventDefault: jest.fn(),
    //       target: {
    //         elements: {
    //           email: { value: mockPayload.email },
    //           password: { value: mockPayload.password },
    //         },
    //       },
    //     } as unknown as React.FormEvent<HTMLFormElement>);
    //   });

    //   // Assertions for unknown error
    //   expect(result.current.openSnackbar).toBe(true);
    //   expect(result.current.snackbarMessage).toBe('An unknown error occurred');
    //   expect(result.current.snackbarSeverity).toBe('error');
    //   expect(result.current.formik.values.email).toBe('test@example.com');
    //   expect(result.current.formik.values.password).toBe('password123');
    // });

    test('handles Snackbar close event', async () => {
        const { result } = renderHook(() => useLoginHandler())

        // Simulate closing Snackbar
        act(() => {
            result.current.handleSnackbarClose(undefined, 'clickaway')
        })

        expect(result.current.openSnackbar).toBe(false)

        act(() => {
            result.current.handleSnackbarClose()
        })

        expect(result.current.openSnackbar).toBe(false)
    })
})
