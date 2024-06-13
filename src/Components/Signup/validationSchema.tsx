import * as Yup from 'yup';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Please enter your username'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Please enter your phone number'),
  secondaryPhone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .notRequired(), // Assuming secondary phone is optional
 
  secondaryEmail: Yup.string()
    .email('Invalid email format')
    .notRequired(), // Assuming secondary email is optional
  address1: Yup.string()
    .required('Please enter your address line 1'),
  address2: Yup.string()
    .notRequired(), // Assuming address line 2 is optional
  state: Yup.string()
    .required('Please enter your state'),
  city: Yup.string()
    .required('Please enter your city'),
  zip: Yup.string()
    .matches(/^\d{5}$/, 'Zip code must be 5 digits')
    .required('Please enter your zip code'),
  imageUrl: Yup.string()
    .url('Invalid URL format')
    .notRequired(), // Assuming image URL is optional
  password: Yup.string()
    .required('Please enter a password')
    .min(8, 'Password must be 8 characters or longer'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default validationSchema;
