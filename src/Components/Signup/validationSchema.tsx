import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Please enter your name'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter your email'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number is not valid")
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .required('Please enter a password')
    .min(8, 'Password must be 8 characters or longer'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default validationSchema;
