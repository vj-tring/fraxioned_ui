import React, { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import SidePanel from '../../components/sidepanel'
import Calendar from '../../components/big-calendar';
import userImage from '../../assets/images/profile.jpeg'
import CustomNavbar from '../../components/navbar';
import { isAuthenticated } from '../../authService';
import UserDetails from '../user-details';
import fraxionedLogo from '../../assets/images/fraxioned-owners.png'
import './admin-dashboard.css'

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
                onUserImageClick={() => navigate('/admin/profile')} links={[]} />
            <div className="dashboard-content">
                <SidePanel isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/admin/bookings" replace />} />
                        <Route path="/bookings" element={<Calendar isSidebarOpen={isSidebarOpen} />} />
                        <Route path="/profile" element={<UserDetails />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


