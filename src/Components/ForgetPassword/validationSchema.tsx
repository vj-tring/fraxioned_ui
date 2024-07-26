import * as Yup from 'yup'

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const validationSchema = Yup.object({
  email: Yup.string()
    .matches(emailRegex, 'Invalid email address')
    .required('Please enter your email'),
})

export default validationSchema
