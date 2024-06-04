import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter your email'),
  password: Yup.string()
    .required('Please enter a password')
    .min(8, 'Password must be 8 characters or longer'),
});

export default validationSchema;
