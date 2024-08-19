import React, { useState, useEffect } from 'react'
import styles from './register.module.css'
import { IoMdClose } from "react-icons/io"
import { useDispatch } from 'react-redux'
import { registerUser } from '../../store/slice/auth/register'
import { AppDispatch } from '../../store'

import { getProperties, getRoles } from '../../api';
import Loader from '@/components/loader'
import CustomizedSnackbars from '@/components/customized-snackbar'
interface RegisterFormContentProps {
    onClose: () => void
  }
  

  const RegisterFormContent: React.FC<RegisterFormContentProps> = ({ onClose }) => {
    const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    phoneNumber: '',
    roleId: 0,
    propertyID: 0,
  })

  // States for dynamically fetched data
  const [roles, setRoles] = useState<[]>([])
  const [properties, setProperties] = useState<[]>([])
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    addressLine1: '',
    phoneNumber: '',
    roleId: '',
    propertyID: '',
  })

  const [showSnackbar, setShowSnackbar] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>(
    'success'
  )

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // Fetch roles from API
    const fetchProperties = async () => {
      try {
        const response = await getProperties()
        const property = response.data.map((property: any) => {
          return property
        })
        setProperties(property)
      } catch (error) {
        console.error('Failed to fetch roles', error)
      }
    }

    const fetchRoles = async () => {
      try {
        const response = await getRoles()
        const roles = response.data.roles.map((roles: any) => {
          return roles
        })
        setRoles(roles)
      } catch (error) {
        console.error('Failed to fetch properties', error)
      }
    }

    fetchRoles()
    fetchProperties()
  }, [])

  const handleTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target
    setFormValues({
      ...formValues,
      [name]: value,
    })
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: parseInt(value, 10),
    })
  }

  const validate = () => {
    let hasErrors = false
    const newErrors: any = {}

    if (!formValues.firstName) {
      newErrors.firstName = 'First name is required'
      hasErrors = true
    }
    else if (!formValues.lastName) {
      newErrors.lastName = 'Last name is required'
      hasErrors = true
    }
    else if (!formValues.email) {
      newErrors.email = 'Email is required'
      hasErrors = true
    }
    else if (!formValues.addressLine1) {
      newErrors.addressLine1 = 'Address Line 1 is required'
      hasErrors = true
    }
    else if (!formValues.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required'
      hasErrors = true
    }
    else if (formValues.roleId === 0) {
      newErrors.roleId = 'Role is required'
      hasErrors = true
    }
    else if (formValues.propertyID === 0) {
      newErrors.propertyID = 'Property ID is required'
      hasErrors = true
    }

    setErrors(newErrors)
    return !hasErrors
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (validate()) {
      setIsLoading(true)
      const payload = {
        email: formValues.email.trim().toLowerCase(),
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        addressLine1: formValues.addressLine1.trim(),
        addressLine2: '', // Default value
        state: 'Tamil Nadu', // Default value
        country: 'India', // Default value
        city: 'Salem', // Default value
        zipcode: '123456', // Default value
        phoneNumber: formValues.phoneNumber.trim(),
        roleId: formValues.roleId,
        updatedBy: 1, // Default value
        createdBy: 1, // Default value
        userPropertyDetails: {
          propertyID: formValues.propertyID,
          noOfShares: '', // Default value
          acquisitionDate: new Date().toISOString(), // Default to current date
        },
      }

      try {
        const register = await dispatch(registerUser(payload)).unwrap()
        setIsLoading(false)
        if (register.message === 'Invite sent successfully') {
          setSnackbarMessage(register.message)
          setSnackbarSeverity('success')
          setShowSnackbar(true)
          setFormValues({
            firstName: '',
            lastName: '',
            email: '',
            addressLine1: '',
            phoneNumber: '',
            roleId: 0,
            propertyID: 0,
          })
          setTimeout(() => {
            setIsLoading(true)
            onClose()
            setIsLoading(false)
          }, 1000)
        } else {
          setSnackbarMessage(register.message)
          setSnackbarSeverity('error')
          setShowSnackbar(true)
        }
      } catch (error) {
        setIsLoading(false)
        console.error('Registration Error:', error)
        setSnackbarMessage('Registration failed. Please try again.')
        setSnackbarSeverity('error')
        setShowSnackbar(true)
      }
    } else {
      setSnackbarMessage('Please correct the errors')
      setSnackbarSeverity('error')
      setShowSnackbar(true)
    }
  }


  return (
    <>
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {isLoading && <Loader />}
        <div className={styles.closeIconContainer}>
          <IoMdClose
            data-testid="close-icon"
            className={styles.closeIcon}
            onClick={onClose}
          />
          </div>
        <h2 className={styles.title}>Create New Account</h2>
        <p className={styles.subtitle}>Fill in the details below</p>
        <form onSubmit={handleSubmit} className={styles.form}>
              {/* Replace TextField components with regular inputs */}
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formValues.firstName}
                  onChange={handleTextFieldChange}
                  className={errors.firstName ? styles.errorInput : ""}
                />
                {errors.firstName && <div className={styles.errorMessage}>{errors.firstName}</div>}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formValues.lastName}
                  onChange={handleTextFieldChange}
                  className={errors.lastName ? styles.errorInput : ""}
                />
                {errors.lastName && <div className={styles.errorMessage}>{errors.lastName}</div>}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  value={formValues.email}
                  onChange={handleTextFieldChange}
                  className={errors.email ? styles.errorInput : ""}
                />
                {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  placeholder="Address Line 1"
                  value={formValues.addressLine1}
                  onChange={handleTextFieldChange}
                  className={errors.addressLine1 ? styles.errorInput : ""}
                />
                {errors.addressLine1 && <div className={styles.errorMessage}>{errors.addressLine1}</div>}
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="number"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formValues.phoneNumber}
                  onChange={handleTextFieldChange}
                  className={errors.phoneNumber ? styles.errorInput : ""}
                />
                {errors.phoneNumber && <div className={styles.errorMessage}>{errors.phoneNumber}</div>}
              </div>
              <div className={styles.inputGroup}>
                <select
                  id="roleId"
                  name="roleId"
                  value={formValues.roleId}
                  onChange={handleSelectChange}
                  className={errors.roleId ? styles.errorInput : ""}
                >
                  <option value={0}>Select Role</option>
                  {roles.map((role: any) => (
                    <option key={role.id} value={role.id}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
                {errors.roleId && <div className={styles.errorMessage}>{errors.roleId}</div>}
              </div>
              <div className={styles.inputGroup}>
                <select
                  id="propertyID"
                  name="propertyID"
                  value={formValues.propertyID}
                  onChange={handleSelectChange}
                  className={errors.propertyID ? styles.errorInput : ""}
                >
                  <option value={0}>Select Property</option>
                  {properties.map((property: any) => (
                    <option key={property.id} value={property.id}>
                      {property.propertyName}
                    </option>
                  ))}
                </select>
                {errors.propertyID && <div className={styles.errorMessage}>{errors.propertyID}</div>}
              </div>
              <button type="submit" className={styles.submitButton}>
                Register
              </button>
            </form>
          </div>
        </div>

      <CustomizedSnackbars
        open={showSnackbar}
        handleClose={() => setShowSnackbar(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
  )
}

export default RegisterFormContent
