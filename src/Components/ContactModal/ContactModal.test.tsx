import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ContactModal from './ContactModal'

jest.mock('../../assets/Fraxioned-icon.png', () => 'Fraxioned-icon.png')

describe('ContactModal', () => {
  it('renders correctly', () => {
    render(
      <ContactModal
        show={false}
        handleClose={function (): void {
          throw new Error('Function not implemented.')
        }}
      />
    )
  })

  it('calls handleClose when close button is clicked', () => {
    const show = true
    const handleClose = jest.fn()
    render(<ContactModal show={show} handleClose={handleClose} />)

    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('renders Contact component', () => {
    const show = true
    const handleClose = jest.fn()
    render(<ContactModal show={show} handleClose={handleClose} />)

    // Assuming you have specific text inside Contact component that you want to test
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
    // Test other parts of Contact component if necessary
  })

  it('does not render when show is false', () => {
    const show = false
    const handleClose = jest.fn()
    render(<ContactModal show={show} handleClose={handleClose} />)

    expect(screen.queryByText('Contact Us')).not.toBeInTheDocument()
  })
})
