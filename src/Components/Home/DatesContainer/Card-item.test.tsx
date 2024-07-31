// CardItem.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CardItem from '../DatesContainer/Card-item'

describe('CardItem Component', () => {
  test('renders without crashing', () => {
    render(<CardItem />)
    expect(screen.getByText('Who')).toBeInTheDocument()
    expect(screen.getByText('Add guests')).toBeInTheDocument()
  })

  test('dropdown visibility toggles on click', () => {
    render(<CardItem />)
    const toggleButton = screen.getByText('Add guests')

    // Check that the dropdown is not visible initially
    expect(screen.queryByText('Adults:')).not.toBeInTheDocument()

    // Click to show dropdown
    fireEvent.click(toggleButton)
    expect(screen.getByText('Adults:')).toBeInTheDocument()

    // Click again to hide dropdown
    fireEvent.click(toggleButton)
    expect(screen.queryByText('Adults:')).not.toBeInTheDocument()
  })

  //   test('increments and decrements for adults', () => {
  //     render(<CardItem />)
  //     const toggleButton = screen.getByText('Add guests')

  //     // Show dropdown
  //     fireEvent.click(toggleButton)

  //     const incrementButton = screen.getByText('+')
  //     const decrementButton = screen.getByText('-')
  //     const countSpan = screen.getByText('1') // initial count for adults

  //     // Increment adults count
  //     fireEvent.click(incrementButton)
  //     expect(screen.getByText('2')).toBeInTheDocument()

  //     // Decrement adults count
  //     fireEvent.click(decrementButton)
  //     expect(screen.getByText('1')).toBeInTheDocument()

  //     // Decrement should not go below 1
  //     fireEvent.click(decrementButton)
  //     expect(screen.getByText('1')).toBeInTheDocument()
  //   })

  //   test('increments and decrements for children, infants, and pets', () => {
  //     render(<CardItem />)
  //     const toggleButton = screen.getByText('Add guests')

  //     // Show dropdown
  //     fireEvent.click(toggleButton)

  //     // Test for children
  //     const childrenIncrementButton = screen.getAllByText('+')[1]
  //     const childrenDecrementButton = screen.getAllByText('-')[1]
  //     const childrenCountSpan = screen.getByText('0') // initial count for children

  //     // Increment children count
  //     fireEvent.click(childrenIncrementButton)
  //     expect(screen.getByText('1')).toBeInTheDocument()

  //     // Decrement children count
  //     fireEvent.click(childrenDecrementButton)
  //     expect(screen.getByText('0')).toBeInTheDocument()

  //     // Decrement should not go below 0
  //     fireEvent.click(childrenDecrementButton)
  //     expect(screen.getByText('0')).toBeInTheDocument()

  //     // Similarly, test for infants and pets if needed
  //   })

  //   test('dropdown does not propagate click events', () => {
  //     render(<CardItem />)
  //     const toggleButton = screen.getByText('Add guests')

  //     // Show dropdown
  //     fireEvent.click(toggleButton)
  //     // const dropdown = screen.getByText('Adults:').closest('div')

  //     // Click outside dropdown to check if it hides
  //     fireEvent.click(document.body)
  //     expect(screen.queryByText('Adults:')).not.toBeInTheDocument()
  //   })
})
