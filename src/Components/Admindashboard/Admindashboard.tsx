import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SidePanel from 'Components/Sidepanel/Sidepanel';
import Calendar from 'Components/BigCalender/BigCalender';
import userImage from '../../assets/profile.jpeg'
import CustomNavbar from 'Components/Navbar/Navbar';
import fraxionedLogo from '../../assets/images/BB - Owners.png'
import './Admindashboard.css'

const AdminDashboard: React.FC = () => {

    return (
        <div className="admin-dashboard-container">

            <CustomNavbar
                logo={fraxionedLogo}
                userName={userImage}
                userImage={userImage}

            />

            <div className="dashboard-content">
                <SidePanel />
                <div className="content">
                    <Routes>
                        <Route path="/bookings" element={<Calendar />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
