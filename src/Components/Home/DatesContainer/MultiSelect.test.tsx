// MultipleSelect.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MultipleSelect from './MultipleSelect' // adjust the import path as needed

describe('MultipleSelect Component', () => {
  test('renders without crashing', () => {
    render(<MultipleSelect />)

    // Check if the button is rendered
    expect(screen.getByText('Add guests')).toBeInTheDocument()
  })

  //   test('menu opens and closes on button click', () => {
  //     render(<MultipleSelect />)

  //     // Click to open the menu
  //     fireEvent.click(screen.getByText('Add guests'))
  //     expect(screen.getByText('Adults')).toBeInTheDocument() // Check if the menu item is visible

  //     // Click to close the menu
  //     fireEvent.click(document.body)
  //     expect(screen.queryByText('Adults')).not.toBeInTheDocument() // Check if the menu item is hidden
  //   })

  //   test('count changes when increment and decrement buttons are clicked', async () => {
  //     render(<MultipleSelect />)

  //     // Open the menu
  //     fireEvent.click(screen.getByText('Add guests'))

  //     // Find and interact with the buttons for 'Adults'
  //     const adultIncreaseButton = screen.getAllByRole('button', { name: '+' })[0]
  //     const adultDecreaseButton = screen.getAllByRole('button', { name: '-' })[0]
  //     // const adultCount = screen.getByText('1') // initial count for adults

  //     // Click increment button
  //     fireEvent.click(adultIncreaseButton)
  //     await waitFor(() => expect(screen.getByText('2')).toBeInTheDocument())

  //     // Click decrement button
  //     fireEvent.click(adultDecreaseButton)
  //     await waitFor(() => expect(screen.getByText('1')).toBeInTheDocument())

  //     // Click decrement button when count is 0
  //     fireEvent.click(adultDecreaseButton)
  //     await waitFor(() => expect(screen.getByText('0')).toBeInTheDocument())
  //   })

  //   test('scrolling closes the menu', () => {
  //     render(<MultipleSelect />)

  //     // Open the menu
  //     fireEvent.click(screen.getByText('Add guests'))
  //     expect(screen.getByText('Adults')).toBeInTheDocument()

  //     // Simulate scroll event
  //     fireEvent.scroll(window, { target: { scrollY: 100 } })

  //     // Wait for the menu to close
  //     // expect(screen.queryByText('Adults')).not.toBeInTheDocument()
  //   })
})
