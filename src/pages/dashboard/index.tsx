import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import CustomNavbar from '../../components/navbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import fraxionedLogo from '../../assets/images/BB - Owners.png'
import userImage from '../../assets/images/profile.jpeg'
import './dashboard.css'
import Contact from '../contact-us'
import UserDetails from '../user-details'
import ComingSoon from '../../components/coming-soon'
import { isAuthenticated } from '../../authService'
import Footer from '../../components/footer';
import Home from '../home'
import CustomizedAccordions from '../../components/customized-accordians';
import Booking from '../booking'
// import PeakSeasonCard from 'Components/Home/PeakSeasonCard'

const Dashboard: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
    }
  }, [navigate])

  const links = [
    { name: 'HOME', href: '/dashboard', disabled: false },
    { name: 'BOOKING', href: '/dashboard/booking', disabled: false },
    { name: 'PEAK SEASON', href: '/dashboard/peak-season', disabled: false },
    { name: 'PAYMENTS', href: '/dashboard/payements', disabled: false },
    { name: 'FAQ', href: '/dashboard/faq', disabled: false }, 
    
  ]

  return (
    <div className="dashboard-container">
      <CustomNavbar
        logo={fraxionedLogo}
        links={links}
        userImage={userImage}
        userName={userEmail}
        onUserImageClick={() => navigate('/dashboard/profile')}
      />

      <div className="content-container">
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<CustomizedAccordions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<UserDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/peak-season" element={<ComingSoon/>} />
            <Route path="/payments" element={<ComingSoon />} /> 
            <Route path="*" element={<Navigate to="/dashboard" />} />

          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard
