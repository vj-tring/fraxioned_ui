import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PortURL } from '../../Components/config'
import { useFormik } from 'formik'
import validationSchema from './validationSchema'

const useLoginHandler = () => {
    const navigate = useNavigate()

    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [snackbarSeverity, setSnackbarSeverity] = useState<
        'success' | 'info' | 'warning' | 'error'
    >('success')

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`${PortURL}/authentication/login`, values)
                if (response.status === 200) {
                    const { data } = response
                    console.log('dataresponse', data)
                    localStorage.setItem('email', data.email)
                    localStorage.setItem('userData', JSON.stringify(data)) // Store the entire data object

                    setSnackbarMessage('Login successful!')
                    setSnackbarSeverity('success')
                    setOpenSnackbar(true)
                    navigate('/dashboard')
                }
            } catch (error) {
                setSnackbarMessage('Invalid Credentials!')
                setSnackbarSeverity('error')
                setOpenSnackbar(true)
                formik.resetForm()
            }
        },
    })

    const handleSnackbarClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenSnackbar(false)
    }

    return {
        formik,
        openSnackbar,
        snackbarMessage,
        snackbarSeverity,
        handleSnackbarClose,
    }
}

export default useLoginHandler
