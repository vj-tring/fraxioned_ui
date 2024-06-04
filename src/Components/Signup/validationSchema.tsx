import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Please enter your name'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter your email'),
  password: Yup.string()
    .required('Please enter a password')
    .min(8, 'Password must be 8 characters or longer'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default validationSchema;
