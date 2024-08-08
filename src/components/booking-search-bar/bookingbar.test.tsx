// Date.test.tsx
// import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import  from './index' // adjust the import path as needed


jest.mock('../property-carousel', () => () => <div>BasicSelect Component</div>)
jest.mock('../guest-selector', () => () => <div>MultipleSelect Component</div>)
jest.mock('../calender', () => () => <div>Calendar Component</div>)

describe('Date Component', () => {
  test('renders without crashing', () => {
    render(< />)

    // Check if the child components are rendered
    expect(screen.getByText('BasicSelect Component')).toBeInTheDocument()
    expect(screen.getByText('Calendar Component')).toBeInTheDocument()
    expect(screen.getByText('Region Component')).toBeInTheDocument()
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
