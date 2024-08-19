import React, { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import SidePanel from '@/components/sidepanel';
import Holidays from '../grid/holiday-grid';
import Calendar from '@/components/big-calendar';
import Property from '../grid/property-grid';
import userImage from '../../assets/images/profile.jpeg'
import CustomNavbar from '@/components/navbar';
import fraxionedLogo from '../../assets/images/property-images/fraxioned-main.png'
import './admin-dashboard.css'

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate()
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                        <Route path="/holidays" element={<Holidays isSidebarOpen={isSidebarOpen} />} />
                        <Route path="/property" element={<Property isSidebarOpen={isSidebarOpen} />} />

                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;