import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from './Home';

describe('Home Component', () => {
  test('renders the welcome owner message', () => {
    render(<Home />);
    expect(screen.getByText(/WELCOME OWNER!/i)).toBeInTheDocument();
  });

  test('renders the your homes heading', () => {
    render(<Home />);
    expect(screen.getByText(/YOUR HOMES/i)).toBeInTheDocument();
  });

  test('renders the home image', () => {
    render(<Home />);
    const image = screen.getByAltText(/Blue Bear Lake/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'building.jpg'); // Adjust the path if necessary
  });

  test('renders the home details', () => {
    render(<Home />);
    expect(screen.getByText(/BLUE BEAR LAKE/i)).toBeInTheDocument();
    expect(screen.getByText(/537 Blue Lake St, Garden City, UT 84078/i)).toBeInTheDocument();
    expect(screen.getByText(/YOU OWN 1\/8 SHARE/i)).toBeInTheDocument();
  });

  test('renders the book a stay button', () => {
    render(<Home />);
    expect(screen.getByText(/BOOK A STAY/i)).toBeInTheDocument();
  });

  test('renders off-season 2024 details', () => {
    render(<Home />);
    expect(screen.getByText(/OFF-SEASON 2024/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Dec 31 - May 29 & Sept 20/i)).toBeInTheDocument();
    const totalNightsElements = screen.getAllByText(/TOTAL NIGHTS/i);
    expect(totalNightsElements.length).toBeGreaterThan(1);
    expect(totalNightsElements[0]).toBeInTheDocument();
    expect(screen.getByText(/30/i)).toBeInTheDocument();
    expect(screen.getByText(/NIGHTS USED/i)).toBeInTheDocument();
    expect(screen.getByText(/0/i)).toBeInTheDocument();
    expect(screen.getByText(/NIGHTS BOOKED/i)).toBeInTheDocument();
    expect(screen.getByText(/7/i)).toBeInTheDocument();
    expect(screen.getByText(/NIGHTS REMAINING/i)).toBeInTheDocument();
    expect(screen.getByText(/23/i)).toBeInTheDocument();
    expect(screen.getByText(/TOTAL HOLIDAYS/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
    expect(screen.getByText(/HOLIDAYS USED/i)).toBeInTheDocument();
    expect(screen.getByText(/0/i)).toBeInTheDocument();
    expect(screen.getByText(/HOLIDAYS BOOKED/i)).toBeInTheDocument();
    expect(screen.getByText(/0/i)).toBeInTheDocument();
    expect(screen.getByText(/HOLIDAYS REMAINING/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
  });

  test('renders peak-season 2024 details', () => {
    render(<Home />);
    expect(screen.getByText(/PEAK-SEASON 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/May 30 - Sept 19/i)).toBeInTheDocument();
    const totalNightsElements = screen.getAllByText(/TOTAL NIGHTS/i);
    expect(totalNightsElements.length).toBeGreaterThan(1);
    expect(totalNightsElements[1]).toBeInTheDocument();
    expect(screen.getByText(/14/i)).toBeInTheDocument();
    expect(screen.getByText(/NIGHTS STAYING/i)).toBeInTheDocument();
    expect(screen.getByText(/5/i)).toBeInTheDocument();
    expect(screen.getByText(/NIGHTS RENTING/i)).toBeInTheDocument();
    expect(screen.getByText(/9/i)).toBeInTheDocument();
    expect(screen.getByText(/NIGHTS UNDECIDED/i)).toBeInTheDocument();
    expect(screen.getByText(/0/i)).toBeInTheDocument();
    expect(screen.getByText(/MY 2024 PEAK-SEASON/i)).toBeInTheDocument();
  });
});
