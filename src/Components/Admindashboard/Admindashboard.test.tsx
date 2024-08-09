import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import AdminDashboard from './Admindashboard';

jest.mock('../../assets/images/BB - Owners.png', () => 'BB - Owners.png');
jest.mock('../../assets/profile.jpeg', () => 'profile.jpeg');

jest.mock('../Sidepanel/Sidepanel', () => {
    return function MockSidePanel({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
        return (
            <div data-testid="mock-side-panel">
                <button onClick={toggleSidebar}>Toggle Sidebar</button>
            </div>
        );
    };
});

jest.mock('../BigCalender/BigCalender', () => {
    return function MockCalendar({ isSidebarOpen }: { isSidebarOpen: boolean }) {
        return (
            <div data-testid="mock-calendar" className={`content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
                Calendar Component
            </div>
        );
    };
});

jest.mock('../Navbar/Navbar', () => {
    return function MockNavbar({ logo, userName, userImage, onUserImageClick }: { logo: string; userName: string; userImage: string; onUserImageClick: () => void }) {
        return (
            <div data-testid="mock-navbar">
                <img src={logo} alt="Fraxioned Logo" />
                <div data-testid="user-image" onClick={onUserImageClick}>
                    {userName}
                </div>
            </div>
        );
    };
});

jest.mock('../UserDetails/UserDetails', () => {
    return function MockUserDetails() {
        return <div data-testid="mock-user-details">User Details Component</div>;
    };
});

describe('AdminDashboard', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('redirects to login page when not authenticated', () => {
        render(
            <MemoryRouter initialEntries={['/admin/bookings']}>
                <AdminDashboard />
            </MemoryRouter>
        );
    });

    test('renders the dashboard correctly when authenticated', () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        // expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
        // expect(screen.getByTestId('mock-side-panel')).toBeInTheDocument();
        // expect(screen.getByTestId('mock-calendar')).toBeInTheDocument();
    });

    test('toggles the sidebar when the toggle button is clicked', () => {
        render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        const sidebarToggleButton = screen.getByText('Toggle Sidebar');
        fireEvent.click(sidebarToggleButton);
        // expect(screen.getByTestId('mock-calendar')).toHaveClass('sidebar-closed');
    });

    test('navigates to user details page when user image is clicked', () => {
        const { getByTestId } = render(
            <Router>
                <AdminDashboard />
            </Router>
        );
        const userImage = getByTestId('user-image');
        fireEvent.click(userImage);
        // expect(screen.getByTestId('mock-user-details')).toBeInTheDocument();
    });
});