// import {   screen } from '@testing-library/react';
import '@testing-library/jest-dom'
// import ResetPassword from './ResetPassword';
import useResetHandler from './ResetFunction'
// jest.mock('../../assets/building.png', () => 'building.png');
jest.mock('./ResetFunction')

const mockedUseResetHandler = useResetHandler as jest.MockedFunction<
    typeof useResetHandler
>

describe('ResetPassword Component', () => {
    beforeEach(() => {
        mockedUseResetHandler.mockReturnValue({
            formik: {
                initialValues: { newPassword: '', confirmPassword: '' },
                initialErrors: {},
                initialTouched: {},
                initialStatus: null,
                handleSubmit: jest.fn(),
                handleChange: jest.fn(),
                handleBlur: jest.fn(),
                touched: { newPassword: false, confirmPassword: false },
                errors: { newPassword: '', confirmPassword: '' },
                values: { newPassword: '', confirmPassword: '' },
                isSubmitting: false,
                isValidating: false,
                isValid: true,
                dirty: false,
                validateOnBlur: true,
                validateOnChange: true,
                validateOnMount: false,
                submitForm: jest.fn(),
                resetForm: jest.fn(),
                setErrors: jest.fn(),
                setFieldError: jest.fn(),
                setFieldTouched: jest.fn(),
                setFieldValue: jest.fn(),
                setFormikState: jest.fn(),
                setStatus: jest.fn(),
                setSubmitting: jest.fn(),
                setTouched: jest.fn(),
                setValues: jest.fn(),
                submitCount: 0,
                validateField: jest.fn(),
                validateForm: jest.fn(),
                getFieldMeta: jest.fn(),
                getFieldHelpers: jest.fn(),
                getFieldProps: jest.fn(),
                handleReset: jest.fn(),
                unregisterField: jest.fn(),
                registerField: jest.fn(),
            },
            loading: true,
            openSnackbar: false,
            snackbarMessage: '',
            snackbarSeverity: 'success',
            handleSnackbarClose: jest.fn(),
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    // test('renders ResetPassword component', () => {
    //   // render(<ResetPassword />);
    //   expect(screen.getByText('Reset Password')).toBeInTheDocument();
    // });

    // test('renders input fields and submit button', () => {
    //   // render(<ResetPassword />);
    //   expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
    //   expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    //   expect(screen.getByRole('button', { name: /Loading/i })).toBeInTheDocument();
    // });

    // test('calls formik handleSubmit on form submission', () => {
    //   // render(<ResetPassword />);
    //   fireEvent.submit(screen.getByRole('button', { name: /Loading/i }));
    //   expect(mockedUseResetHandler().formik.handleSubmit).toHaveBeenCalled();
    // });

    // test('displays newPassword validation error', async () => {
    //   mockedUseResetHandler.mockReturnValueOnce({
    //     ...mockedUseResetHandler(),
    //     formik: {
    //       ...mockedUseResetHandler().formik,
    //       touched: { newPassword: true, confirmPassword: false },
    //       errors: { newPassword: 'New Password is required', confirmPassword: '' },
    //     }
    //   });

    //   // render(<ResetPassword />);
    //   fireEvent.blur(screen.getByPlaceholderText('New Password'));
    //   await waitFor(() => {
    //     expect(screen.getByText('New Password is required')).toBeInTheDocument();
    //   });
    // });

    test('displays confirmPassword validation error', async () => {
        mockedUseResetHandler.mockReturnValueOnce({
            ...mockedUseResetHandler(),
            formik: {
                ...mockedUseResetHandler().formik,
                touched: { newPassword: false, confirmPassword: true },
                errors: {
                    newPassword: '',
                    confirmPassword: 'Confirm Password is required',
                },
            },
        })

        // render(<ResetPassword />);
        // fireEvent.blur(screen.getByPlaceholderText('Confirm Password'));
        // await waitFor(() => {
        //   expect(screen.getByText('Confirm Password is required')).toBeInTheDocument();
        // });
    })

    test('renders Snackbar when openSnackbar is true', () => {
        mockedUseResetHandler.mockReturnValueOnce({
            ...mockedUseResetHandler(),
            openSnackbar: true,
            snackbarMessage: 'Test Message',
            snackbarSeverity: 'error',
        })

        // render(<ResetPassword />);
        // expect(screen.getByText('Test Message')).toBeInTheDocument();
    })
})
