import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import homeImage from '../../assets/building.jpg';

describe('Home Component', () => {
  test('renders Home component', () => {
    render(<Home />);
    expect(screen.getByText('WELCOME OWNER!')).toBeInTheDocument();
    expect(screen.getByText('YOUR HOMES')).toBeInTheDocument();
  });

  test('renders home image', () => {
    render(<Home />);
    const image = screen.getByAltText('Blue Bear Lake');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', homeImage);
  });

  test('renders home details', () => {
    render(<Home />);
    expect(screen.getByText('BLUE BEAR LAKE')).toBeInTheDocument();
    expect(screen.getByText('537 Blue Lake St, Garden City, UT 84078')).toBeInTheDocument();
    expect(screen.getByText('YOU OWN 1/8 SHARE')).toBeInTheDocument();
  });

  test('renders book stay button', () => {
    render(<Home />);
    const button = screen.getByText('BOOK A STAY');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('book-stay-btn');
  });

  test('renders off-season table correctly', () => {
    render(<Home />);
    expect(screen.getByText('OFF-SEASON 2024')).toBeInTheDocument();
    expect(screen.getByText('Dec 31 - May 29 & Sept 20 - Dec 30')).toBeInTheDocument();
    expect(screen.getByText('TOTAL NIGHTS')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('NIGHTS USED')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('NIGHTS BOOKED')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('NIGHTS REMAINING')).toBeInTheDocument();
    expect(screen.getByText('23')).toBeInTheDocument();
  });

  test('renders peak-season table correctly', () => {
    render(<Home />);
    expect(screen.getByText('PEAK-SEASON 2024')).toBeInTheDocument();
    expect(screen.getByText('May 30 - Sept 19')).toBeInTheDocument();
    expect(screen.getByText('TOTAL NIGHTS')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
    expect(screen.getByText('NIGHTS STAYING')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('NIGHTS RENTING')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('NIGHTS UNDECIDED')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('renders peak-season button', () => {
    render(<Home />);
    const button = screen.getByText('MY 2024 PEAK-SEASON');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('peak-season-btn');
  });
});