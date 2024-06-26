import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import Home from './Home'; 


jest.mock('../../assets/building.jpg', () => ({
  default: 'mocked-home-image-path',
}));

describe('Home Component', () => {
  it('renders welcome message', () => {
    render(<Home />);
    expect(screen.getByText('WELCOME OWNER!')).toBeInTheDocument();
  });

  it('renders book stay button', () => {
    render(<Home />);
    expect(screen.getByText('BOOK A STAY')).toBeInTheDocument();
  });

  it('renders peak-season button', () => {
    render(<Home />);
    expect(screen.getByText('MY 2024 PEAK-SEASON')).toBeInTheDocument();
  });
});
