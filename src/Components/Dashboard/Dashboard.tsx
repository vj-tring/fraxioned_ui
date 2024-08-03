import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import CustomNavbar from '../../Components/Navbar/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css'

import fraxionedLogo from '../../assets/images/BB - Owners.png'
import Footer from '../../Footer/Footer'
import userImage from '../../assets/profile.jpeg'
import './Dashboard.css'
import Home from '../Home/Home'
import CustomizedAccordions from '../CustomizedAccordions/CustomizedAccordions'
import Contact from '../ContactUs/Contact'
import UserDetails from '../UserDetails/UserDetails'
import ComingSoon from '../ComingSoon/ComingSoon'
import { isAuthenticated } from '../../authService'

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
    { name: 'BOOKING', href: '/dashboard', disabled: false },
    { name: 'PEAK SEASON', href: '/dashboard', disabled: false },
    { name: 'PAYEMENTS', href: '/dashboard', disabled: false },
    { name: 'FAQ', href: '/dashboard', disabled: false },
  ]

  return (
    <div className="dashboard-container">
      <CustomNavbar
        logo={fraxionedLogo}
        links={links}
        userImage={userImage}
        userName={userEmail}
        onUserImageClick={() => navigate('/dashboard/user-details')}
      />

      <div className="content-container">
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/faq" element={<CustomizedAccordions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/user-details" element={<UserDetails />} />
            <Route path="/booking" element={<ComingSoon />} />
            <Route path="/peak-season" element={<ComingSoon />} />
            <Route path="/payements" element={<ComingSoon />} />
          </Routes>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard
