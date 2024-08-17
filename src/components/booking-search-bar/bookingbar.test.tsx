// Date.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BookingSearchBar from './index' // adjust the import path as needed

jest.mock('@/lib/utils', () => ({
  cn: jest.fn(),
}));

jest.mock('../property-carousel', () => {
  const MockPropertyCarousel = () => React.createElement('div', null, 'BasicSelect Component');
  return MockPropertyCarousel;
});

jest.mock('../guest-selector', () => {
  const MockGuestSelector = () => React.createElement('div', null, 'MultipleSelect Component');
  return MockGuestSelector;
});

jest.mock('../region', () => {
  const MockRegion = () => React.createElement('div', null, 'Region Component');
  return MockRegion;
});

// jest.mock('../calender', () => {
//   const MockCalendar = () => React.createElement('div', null, 'Calendar Component');
//   return MockCalendar;
// });

describe('Date Component', () => {
  test('renders without crashing', () => {
    render(React.createElement(BookingSearchBar));

    // Check if the child components are rendered
    expect(screen.getByText('BasicSelect Component')).toBeInTheDocument()
    // expect(screen.getByText('Calendar Component')).toBeInTheDocument()
    // expect(screen.getByText('Region Component')).toBeInTheDocument()
    expect(screen.getByText('MultipleSelect Component')).toBeInTheDocument()
  })

  //   test('renders with correct layout', () => {
  //     render(<Date />)

  //     // Check that the main structure is correct
  //     const mainCard = screen.getByRole('main')
  //     expect(mainCard).toBeInTheDocument()

  //     // Ensure the card has child elements
  //     const card = screen.getByText('BasicSelect Component').closest('.card')
  //     expect(card).toBeInTheDocument()

  //     const calendar = screen.getByText('Calendar Component')
  //     expect(calendar).toBeInTheDocument()

  //     const region = screen.getByText('Region Component')
  //     expect(region).toBeInTheDocument()

  //     const multipleSelect = screen.getByText('MultipleSelect Component')
  //     expect(multipleSelect).toBeInTheDocument()

  //     // Ensure vertical lines are present
  //     // expect(screen.getAllByClassName('vl')).toHaveLength(3)
  //   })
})
