import * as Yup from 'yup';

// const validationSchema = Yup.object({
//   username: Yup.string()
//     .required('Please enter your user name'),
//   firstName: Yup.string()
//     .required('Please enter your first name'),
//   lastName: Yup.string()
//     .required('Please enter your last name'),
//   phone: Yup.string()
//     .matches(/^\d{10}$/, 'Phone number must be 10 digits')
//     .required('Please enter your phone number'),
//   secondaryPhone: Yup.string()
//     .matches(/^\d{10}$/, 'Phone number must be 10 digits')
//     .notRequired(),
//   secondaryEmail: Yup.string()
//     .email('Invalid email format')
//     .notRequired(),
//   address1: Yup.string()
//     .required('Please enter your address line 1'),
//   address2: Yup.string()
//     .notRequired(),
//   state: Yup.string()
//     .required('Please enter your state'),
//   city: Yup.string()
//     .required('Please enter your city'),
//   zip: Yup.string()
//     .matches(/^\d{5}$/, 'Zip code must be 5 digits')
//     .required('Please enter your zip code'),
//   imageUrl: Yup.mixed()
//     .test('fileType', 'Invalid file format', (value) => {
//       // Allow null or check if it's a File object
//       return !value || (value instanceof File);
//     })
//     .test('fileSize', 'File size is too large', (value) => {
//       if (!value) return true; // If value is null, return true (valid)

//       // Type assertion to treat value as File
//       const file = value as File;
//       // Adjust max file size limit as needed (10MB in this case)
//       return file.size <= 10 * 1024 * 1024;
//     })
//     .nullable()
//     .notRequired(),
//   password: Yup.string()
//     .required('Please enter a password')
//     .min(8, 'Password must be 8 characters or longer'),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref('password')], 'Passwords must match')
//     .required('Please confirm your password'),
// });

// export default validationSchema;
