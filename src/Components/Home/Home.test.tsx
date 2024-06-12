// Home.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from './Home';

describe('Home Component', () => {
  it('renders the welcome message', () => {
    render(<Home />);
    const welcomeElement = screen.getByText(/WELCOME OWNER!/i);
    expect(welcomeElement).toBeInTheDocument();
  });

  it('renders the "YOUR HOMES" heading', () => {
    render(<Home />);
    const homesHeading = screen.getByText(/YOUR HOMES/i);
    expect(homesHeading).toBeInTheDocument();
  });

  it('renders the home image with the correct alt text', () => {
    render(<Home />);
    const homeImage = screen.getByAltText('Blue Bear Lake');
    expect(homeImage).toBeInTheDocument();
    expect(homeImage).toHaveAttribute('src', 'building.jpg'); // Check the image src attribute
  });

  it('renders the home details', () => {
    render(<Home />);
    const homeTitle = screen.getByText('BLUE BEAR LAKE');
    const address = screen.getByText('537 Blue Lake St, Garden City, UT 84078');
    const shareInfo = screen.getByText('YOU OWN 1/8 SHARE');
    expect(homeTitle).toBeInTheDocument();
    expect(address).toBeInTheDocument();
    expect(shareInfo).toBeInTheDocument();
  });

  it('renders the "BOOK A STAY" button', () => {
    render(<Home />);
    const bookStayButton = screen.getByRole('button', { name: /BOOK A STAY/i });
    expect(bookStayButton).toBeInTheDocument();
  });

  it('renders off-season table with correct data', () => {
    render(<Home />);
    const offSeasonHeader = screen.getByText('OFF-SEASON 2024');
    const totalNights = screen.getByText('30');
    const nightsUsed = screen.getByText('0', { exact: false });
    const nightsBooked = screen.getByText('7');
    const nightsRemaining = screen.getByText('23');
    const totalHolidays = screen.getByText('1', { exact: false });
    const holidaysUsed = screen.getByText('0', { exact: false });
    const holidaysBooked = screen.getByText('0', { exact: false });
    const holidaysRemaining = screen.getByText('1', { exact: false });

    expect(offSeasonHeader).toBeInTheDocument();
    expect(totalNights).toBeInTheDocument();
    expect(nightsUsed).toBeInTheDocument();
    expect(nightsBooked).toBeInTheDocument();
    expect(nightsRemaining).toBeInTheDocument();
    expect(totalHolidays).toBeInTheDocument();
    expect(holidaysUsed).toBeInTheDocument();
    expect(holidaysBooked).toBeInTheDocument();
    expect(holidaysRemaining).toBeInTheDocument();
  });

  it('renders peak-season table with correct data', () => {
    render(<Home />);
    const peakSeasonHeader = screen.getByText('PEAK-SEASON 2024');
    const totalNights = screen.getByText('14', { exact: false });
    const nightsStaying = screen.getByText('5', { exact: false });
    const nightsRenting = screen.getByText('9', { exact: false });
    const nightsUndecided = screen.getByText('0', { exact: false });

    expect(peakSeasonHeader).toBeInTheDocument();
    expect(totalNights).toBeInTheDocument();
    expect(nightsStaying).toBeInTheDocument();
    expect(nightsRenting).toBeInTheDocument();
    expect(nightsUndecided).toBeInTheDocument();
  });

  it('renders the "MY 2024 PEAK-SEASON" button', () => {
    render(<Home />);
    const peakSeasonButton = screen.getByRole('button', { name: /MY 2024 PEAK-SEASON/i });
    expect(peakSeasonButton).toBeInTheDocument();
  });
});