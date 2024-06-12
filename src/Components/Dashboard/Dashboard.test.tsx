// Dashboard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard1';
import CustomNavbar from '../Navbar/Navbar';
import ContactModal from '../ContactModal/ContactModal';
import Home from '../Home/Home';
import Footer from '../../Footer/Footer';

jest.mock('../Navbar/Navbar', () => jest.fn(() => <div>Mocked Navbar</div>));
jest.mock('../ContactModal/ContactModal', () => jest.fn(({ show }) => show ? <div>Mocked ContactModal</div> : null));
jest.mock('../Home/Home', () => jest.fn(() => <div>Mocked Home</div>));
jest.mock('../../Footer/Footer', () => jest.fn(() => <div>Mocked Footer</div>));

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.setItem('userData', JSON.stringify({ email: 'testuser@example.com' }));
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders Dashboard with CustomNavbar, Home, ContactModal, and Footer', () => {
    render(<Dashboard />);

    // Check if CustomNavbar is rendered with correct props
    expect(CustomNavbar).toHaveBeenCalledWith(
      expect.objectContaining({
        logo: expect.any(String),
        links: expect.arrayContaining([
          expect.objectContaining({ name: 'HOME', href: '/dashboard' }),
          expect.objectContaining({ name: 'BOOKING', href: 'https://www.airbnb.co.in/' }),
          expect.objectContaining({ name: 'PEAK SEASON', href: '/services' }),
          expect.objectContaining({ name: 'PAYEMENTS', href: 'https://payments.google.com/gp/w/home/paymentmethods?sctid=1592381138486457' }),
          expect.objectContaining({ name: 'FAQ', href: '/FAQ' }),
        ]),
        userImage: expect.any(String),
        userName: 'testuser@example.com',
      }),
      {}
    );

    // Check if Home, ContactModal, and Footer are rendered
    expect(screen.getByText('Mocked Home')).toBeInTheDocument();
    expect(screen.queryByText('Mocked ContactModal')).not.toBeInTheDocument();
    expect(screen.getByText('Mocked Footer')).toBeInTheDocument();
  });

  test('renders ContactModal when show state is true', () => {
    render(<Dashboard />);
    
    // Manually set the show state to true
    const setShow = jest.fn();
    setShow(true);

    // Rerender the component
    render(<Dashboard />);

    // Check if ContactModal is rendered when show state is true
    expect(screen.getByText('Mocked ContactModal')).toBeInTheDocument();
  });
});
