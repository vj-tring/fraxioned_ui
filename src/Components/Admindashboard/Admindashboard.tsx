import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import SidePanel from '../Sidepanel/Sidepanel'
import Calendar from '../BigCalender/BigCalender';
import userImage from '../../assets/profile.jpeg'
import CustomNavbar from '../Navbar/Navbar';
import { isAuthenticated } from 'authService';
import UserDetails from '../UserDetails/UserDetails';
import fraxionedLogo from '../../assets/images/BB - Owners.png'
import './Admindashboard.css'

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);



    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/login')
        }
    }, [navigate])

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="admin-dashboard-container">
            <CustomNavbar
                logo={fraxionedLogo}
                userName={userImage}
                userImage={userImage}
                onUserImageClick={() => navigate('/admin/userdetails')}
            />
            <div className="dashboard-content">
                <SidePanel isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/admin/bookings" replace />} />
                        <Route path="/bookings" element={<Calendar isSidebarOpen={isSidebarOpen} />} />
                        <Route path="/userdetails" element={<UserDetails />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

