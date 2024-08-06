import React, {useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import SidePanel from 'Components/Sidepanel/Sidepanel';
import Calendar from 'Components/BigCalender/BigCalender';
import userImage from '../../assets/profile.jpeg'
import CustomNavbar from 'Components/Navbar/Navbar';
import { isAuthenticated } from 'authService';
import UserDetails from 'Components/UserDetails/UserDetails';
import fraxionedLogo from '../../assets/images/BB - Owners.png'
import './Admindashboard.css'

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate()
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login')
        }
    }, [navigate])

    return (
        <div className="admin-dashboard-container">
            <CustomNavbar
                logo={fraxionedLogo}
                userName={userImage}
                userImage={userImage}
                onUserImageClick={() => navigate('/admin/userdetails')}
            />
            <div className="dashboard-content">
                <SidePanel />
                <div className="content">
                    <Routes>
                        <Route path="/bookings" element={<Calendar />} />
                        <Route path="/userdetails" element={<UserDetails />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

