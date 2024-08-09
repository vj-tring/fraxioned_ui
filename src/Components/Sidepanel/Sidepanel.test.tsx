import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';
import SidePanel from './Sidepanel';

jest.mock('../../assets/images/fraxioned_logo.png', () => 'fraxioned_logo.png');
jest.mock('../../assets/Fraxioned-icon.png', () => 'fraxioned_icon.png');

describe('SidePanel', () => {
    const mockToggleSidebar = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders the component correctly', () => {
        render(
            <Router>
                <SidePanel isOpen={true} toggleSidebar={mockToggleSidebar} />
            </Router>
        );
    });

    test('toggles the sidebar when the logo is clicked', () => {
        render(
            <Router>
                <SidePanel isOpen={false} toggleSidebar={mockToggleSidebar} />
            </Router>
        );

        fireEvent.click(screen.getByAltText('Fraxioned Owners\' Portal'));
        expect(mockToggleSidebar).toHaveBeenCalled();
    });

    test('toggles the sidebar when the toggle button is clicked', () => {
        render(
            <Router>
                <SidePanel isOpen={false} toggleSidebar={mockToggleSidebar} />
            </Router>
        );

        fireEvent.click(screen.getByRole('button'));
        expect(mockToggleSidebar).toHaveBeenCalled();
    });

    test('disables menu items when they are marked as disabled', () => {
        render(
            <MemoryRouter initialEntries={['/admin/bookings']}>
                <SidePanel isOpen={true} toggleSidebar={mockToggleSidebar} />
            </MemoryRouter>
        );

        const disabledLink = screen.getByText('Holidays');
        fireEvent.click(disabledLink);
        expect(mockToggleSidebar).not.toHaveBeenCalled();
    });

    test('highlights the active menu item', () => {
        render(
            <MemoryRouter initialEntries={['/admin/bookings']}>
                <SidePanel isOpen={true} toggleSidebar={mockToggleSidebar} />
            </MemoryRouter>
        );
    });

    test('matches the snapshot', () => {
        const { container } = render(
            <Router>
                <SidePanel isOpen={true} toggleSidebar={mockToggleSidebar} />
            </Router>
        );
        expect(container).toMatchSnapshot();
    });
});