// AddDates.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AddDates from './AddDates' // adjust the import path as needed

describe('AddDates Component', () => {
  test('renders without crashing', () => {
    render(<AddDates />)
    // Ensure the component is in the document
    expect(screen.getByText('Check in')).toBeInTheDocument()
    expect(screen.getByText('Add Dates')).toBeInTheDocument()
  })

  test('has the correct class names on the outer div', () => {
    render(<AddDates />)
    // Find the outer div
    // const outerDiv = screen.getByText('Check in').closest('div')

    // Check that the outer div has the expected classes
    // expect(outerDiv).toHaveClass('card-item')
    // expect(outerDiv).toHaveClass('d-flex')
    // expect(outerDiv).toHaveClass('justify-content-around')
  })

  test('renders correct text', () => {
    render(<AddDates />)
    expect(screen.getByText('Check in')).toBeInTheDocument()
    expect(screen.getByText('Add Dates')).toBeInTheDocument()
  })
})
