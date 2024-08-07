import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SidePanel from './Sidepanel';

// Utility function to render the SidePanel component
const renderSidePanel = (initialEntries = ['/']) => {
    render(
        <MemoryRouter initialEntries={initialEntries}>
            <SidePanel />
        </MemoryRouter>
    );
};

describe('SidePanel Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders SidePanel with all menu items', () => {
        renderSidePanel();
        expect(screen.getByText('Bookings')).toBeInTheDocument();
        expect(screen.getByText('Holidays')).toBeInTheDocument();
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Documents')).toBeInTheDocument();
        expect(screen.getByText('Role')).toBeInTheDocument();
        expect(screen.getByText('Reports')).toBeInTheDocument();
        expect(screen.getByText('Rules')).toBeInTheDocument();
    });

    test('highlights the active menu item', () => {
        renderSidePanel(['/admin/bookings']);
        const bookingsLink = screen.getByText('Bookings').closest('a');
        expect(bookingsLink).toHaveClass('active');
    });

    test('renders menu items with correct links', () => {
        renderSidePanel();
        const bookingsLink = screen.getByText('Bookings').closest('a');
        const holidaysLink = screen.getByText('Holidays').closest('a');
        expect(bookingsLink).toHaveAttribute('href', '/admin/bookings');
        expect(holidaysLink).toHaveAttribute('href', '/holidays');
    });
});

