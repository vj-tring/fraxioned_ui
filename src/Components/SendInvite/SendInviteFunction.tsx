import React, { useState } from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
import { sendInvite } from '../../api/SendInvite'

const useSendInviteHandler = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedRole, setSelectedRole] = useState<number | ''>('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const userString = localStorage.getItem('userData')
      if (userString) {
        const userObject = JSON.parse(userString)
        const invitedBy = userObject.id
        console.log('userEmail', invitedBy)
        const payload = { email, roleId: selectedRole, invitedBy }

        // const response = await sendInvite(payload);
        await sendInvite(payload)
        console.log(`Invite sent to: ${email}`)
        setStatus('success')
      }
    } catch (error) {
      console.error('Failed to send invite:', error)
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            'Failed to send the invite. Please try again later.'
        )
      } else {
        setErrorMessage('An unknown error occurred')
      }
      setStatus('error')
    }
  }

  return {
    email,
    status,
    errorMessage,
    handleSubmit,
    setEmail,
    selectedRole,
    setSelectedRole,
  }
}

export default useSendInviteHandler
