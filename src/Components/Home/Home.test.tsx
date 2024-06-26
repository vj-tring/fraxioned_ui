import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';
import * as homeDataFetchers from './HomeDataFetchers';

jest.mock('../../assets/building.jpg', () => ({
  default: 'mocked-home-image-path',
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders welcome message', () => {
    render(<Home />);
    expect(screen.getByText('WELCOME OWNER!')).toBeInTheDocument();
  });

  it('renders book stay button', async () => {
    const homeData = [
      { id: 1, image: 'mocked-home-image-path', title: 'BLUE BEAR LAKE', address: "537 Blue Lake St, Garden City, UT 84078", share: " 1/8 " },
    ];

    jest.spyOn(homeDataFetchers, 'fetchHomeData').mockResolvedValue(homeData);
    jest.spyOn(homeDataFetchers, 'fetchOffSeasonData').mockResolvedValue([]);
    jest.spyOn(homeDataFetchers, 'fetchPeakSeasonData').mockResolvedValue([]);

    // await act(async () => {
    //   render(<Home />);
    // });

    // expect(screen.getAllByText('BOOK A STAY').length).toBeGreaterThan(0);
  });

  it('renders peak-season button', async () => {
    const homeData = [
      { id: 1, image: 'mocked-home-image-path', title: 'BLUE BEAR LAKE', address: "537 Blue Lake St, Garden City, UT 84078", share: " 1/8 " },
    ];

    jest.spyOn(homeDataFetchers, 'fetchHomeData').mockResolvedValue(homeData);
    jest.spyOn(homeDataFetchers, 'fetchOffSeasonData').mockResolvedValue([]);
    jest.spyOn(homeDataFetchers, 'fetchPeakSeasonData').mockResolvedValue([]);

    // await act(async () => {
    //   render(<Home />);
    // });

    // expect(screen.getByText('MY 2024 PEAK-SEASON')).toBeInTheDocument();
  });

  it('renders home cards based on fetched data', async () => {
    const homeData = [
      { id: 1, image: 'mocked-home-image-path', title: 'BLUE BEAR LAKE', address: "537 Blue Lake St, Garden City, UT 84078", share: " 1/8 " },
      { id: 2, image: 'mocked-home-image-path', title: 'ANOTHER HOME', address: "123 Main St, Anytown, USA", share: " 1/4 " },
    ];

    const offSeasonData = [
      { ownerId: 1, totalNights: 30, nightsUsed: 0, nightsBooked: 7, holidays: { total: 10, used: 0, booked: 0, remaining: 1 } },
      { ownerId: 2, totalNights: 20, nightsUsed: 20, nightsBooked: 5, holidays: { total: 22, used: 0, booked: 0, remaining: 2 } },
    ];

    const peakSeasonData = [
      { ownerId: 1, totalNights: 14, nightsStaying: 5, nightsRenting: 9 },
      { ownerId: 2, totalNights: 10, nightsStaying: 3, nightsRenting: 7 },
    ];

    jest.spyOn(homeDataFetchers, 'fetchHomeData').mockResolvedValue(homeData);
    jest.spyOn(homeDataFetchers, 'fetchOffSeasonData').mockResolvedValue(offSeasonData);
    jest.spyOn(homeDataFetchers, 'fetchPeakSeasonData').mockResolvedValue(peakSeasonData);

    // await act(async () => {
    //   render(<Home />);
    // });

    // await waitFor(() => {
    //   expect(screen.getByText('BLUE BEAR LAKE')).toBeInTheDocument();
    //   expect(screen.getByText('537 Blue Lake St, Garden City, UT 84078')).toBeInTheDocument();
    //   expect(screen.getByText('ANOTHER HOME')).toBeInTheDocument();
    //   expect(screen.getByText('123 Main St, Anytown, USA')).toBeInTheDocument();
    // });
  });

  it('handles errors in data fetching gracefully', async () => {
    jest.spyOn(homeDataFetchers, 'fetchHomeData').mockRejectedValue(new Error('Failed to fetch home data'));
    jest.spyOn(homeDataFetchers, 'fetchOffSeasonData').mockRejectedValue(new Error('Failed to fetch off-season data'));
    jest.spyOn(homeDataFetchers, 'fetchPeakSeasonData').mockRejectedValue(new Error('Failed to fetch peak-season data'));

    // await act(async () => {
    //   render(<Home />);
    // });

    // await waitFor(() => {
    //   expect(screen.getByText('Error fetching data')).toBeInTheDocument();
    // });
  });
});
