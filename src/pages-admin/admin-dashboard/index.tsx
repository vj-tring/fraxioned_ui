import React, { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import SidePanel from '@/pages-admin/sidepanel';
import Holidays from '../holiday-page';
import Calendar from '@/components/big-calendar';
import Property from '../grid/property-grid';
import PropertySidePanel from '../propertysidepanel';
import PropertyGeneralInfo from '../property-generalinfo'
import PhotoUpload from '../property-photos/new-photoupload';
import TabSwitch from '../grid/user-grid/edit-form/tab-switch';
import EditPropertyForm from '../property-generalinfo/gerneralinfo-editform';
import AmenityManagement from '../amenity-page';
import EditAmenityForm from '../property-amenities/edit-amenityform';
import PropertyAmenities from '../property-amenities';
import UserGrid from '../grid/user-grid';
import UserProperty from '../property-user';
import EditPropertyRulesForm from '../property-rules/edit-form';
import PropertyPhotos from '../property-photos';
import CustomNavbar from '@/components/navbar';
import BookingsPage from '../bookings-page';
import fraxionedLogo from '../../assets/images/fraxioned.png'
import userImage from '../../assets/images/profile.jpeg'
import './admin-dashboard.css'
import ReportsGrid from '../grid/reports-grid';
import PropertyRulesView from '../property-rules/edit-form';
import PropertyDocuments from '../property-documents';
import DocumentGrid from '../grid/document-grid';
import SpaceProperty from '../space-property';
import SpacePropertyDetails from '../space-property/space-property-details';
import PropertyCode from '../property-codes';
import Spaces from '../spaces';
import "./admin-dashboard.css";
import Faq from '../faq';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    function handleUserUpdated(): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="admin-dashboard-container">
            <CustomNavbar
                logo={fraxionedLogo}
                userName={userImage}
                userImage={userImage}
                onUserImageClick={() => navigate("/admin/userdetails")}
            />
            <div className="dashboard-content">
                <SidePanel isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                <div className={`content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                    <Routes>
                        <Route path="/" element={<Navigate to="admin/bookings" replace />} />
                        <Route path="/bookings" element={<Calendar isSidebarOpen={isSidebarOpen} />} />
                        <Route path="/bookings-page" element={<BookingsPage isSidebarOpen={isSidebarOpen} />} />
                        <Route path="/amenity" element={<AmenityManagement />} />
                        <Route path="/user/:id/edit" element={<TabSwitch onUserUpdated={handleUserUpdated} />} />
                        <Route path="/holidays" element={<Holidays isSidebarOpen={isSidebarOpen} />} />
                        <Route path="/user" element={<UserGrid isSidebarOpen={isSidebarOpen} />} />
                        <Route path="/documents" element={<DocumentGrid isSidebarOpen={isSidebarOpen} />} />
                        <Route path="/reports" element={<ReportsGrid isSidebarOpen={isSidebarOpen} />} />
                        <Route path="/spaces" element={<Spaces isSidebarOpen={isSidebarOpen} />} />
                        <Route path='/Faq' element={<Faq isSidebarOpen={isSidebarOpen}/>} />

                        <Route path="/property" element={<Property isSidebarOpen={isSidebarOpen} />} />
                        <Route path="/property/:id" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <PropertyGeneralInfo />
                                </div>
                            </div>
                        } />
                        <Route path="/property/:id/edit" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <EditPropertyForm />
                                </div>
                            </div>
                        } />
                        <Route path="/property/:id/rules" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <PropertyRulesView />
                                </div>
                            </div>
                        } />
                        <Route path="/property/:id/location" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    {/* <PropertyLocation /> */}
                                </div>
                            </div>
                        } />
                        <Route path="/property/:id/amenities" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <PropertyAmenities />
                                </div>
                            </div>
                        } />
                        <Route path="/property/:id/amenities/edit" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <EditAmenityForm />
                                </div>
                            </div>
                        } />
                        <Route path="/property/:id/photos" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <PropertyPhotos />
                                </div>
                            </div>
                        } />
                        <Route path="/property/:id/photos/upload" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <PhotoUpload />
                                </div>
                            </div>
                        } />
                        <Route path="/property/:id/users" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <UserProperty />
                                </div>
                            </div>
                        } />
                        <Route path="/property/:id/documents" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <PropertyDocuments />
                                </div>
                            </div>
                        } />
                        <Route path="/property/:id/rooms" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <SpaceProperty />
                                </div>
                            </div>
                        } />


                        <Route path="/property/:id/codes" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <PropertyCode />
                                </div>
                            </div>
                        } />

                        <Route path="/property/:id/rooms/:spaceId" element={
                            <div className="property-details-container">
                                <PropertySidePanel isOpen={true} />
                                <div className="property-info-content">
                                    <SpacePropertyDetails />
                                </div>
                            </div>
                        } />
                        <Route path="*" element={<Navigate to="/admin/bookings" />} />
                    </Routes>
                </div>
            </div>
        </div >

    );
};

export default AdminDashboard;
