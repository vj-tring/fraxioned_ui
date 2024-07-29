import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import CustomNavbar from '../Navbar/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import fraxionedLogo from '../../assets/owners.png'
import userImage from '../../assets/profile.jpeg'
import './Dashboard.css'
import { isAuthenticated } from '../../authService'
import Footer from '../Footer/Footer'

const Dashboard: React.FC = () => {
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
    } else {
      const storedUserData = localStorage.getItem('userData')
      if (storedUserData) {
        const userData = JSON.parse(storedUserData)
        if (userData && userData.email) {
          setUserEmail(userData.email)
        }
      }
    }
  }, [navigate])

  const links = [
    { name: 'HOME', href: '/dashboard', disabled: false },
    { name: 'BOOKING', href: '/dashboard/booking', disabled: true },
    { name: 'PEAK SEASON', href: '/dashboard/services', disabled: true },
    { name: 'PAYEMENTS', href: '/dashboard/payements', disabled: true },
    { name: 'FAQ', href: '/faq', disabled: false },
  ]

  return (
    <div className="dashboard-container">
      <CustomNavbar
        logo={fraxionedLogo}
        links={links}
        userImage={userImage}
        userName={userEmail}
        onUserImageClick={() => navigate('/user-details')}
      />

      <div className="content-container">
        <div className="content-wrapper">
          <Routes>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard