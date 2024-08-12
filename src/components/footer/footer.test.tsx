import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Footer from './index'

describe('Footer Component', () => {
  const renderFooter = () =>
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

  test('renders Home link', () => {
    renderFooter()
    const homeLink = screen.getByText('Home')
    expect(homeLink).toBeInTheDocument()
    // expect(homeLink).toHaveAttribute('href', '/');
  })

  test('renders Booking link', () => {
    renderFooter()
    const bookingLink = screen.getByText('Bookings')
    expect(bookingLink).toBeInTheDocument()
    expect(bookingLink).toHaveAttribute('href', '/dashboard/booking')
  })

  test('renders Peak Season link', () => {
    renderFooter()
    const peakSeasonLink = screen.getByText('Payments')
    expect(peakSeasonLink).toBeInTheDocument()
    expect(peakSeasonLink).toHaveAttribute('href', '/dashboard/peak-season')
  })

  test('renders Payments link', () => {
    renderFooter()
    const paymentsLink = screen.getByText('Documents')
    expect(paymentsLink).toBeInTheDocument()
    expect(paymentsLink).toHaveAttribute('href', '/dashboard/payments')
  })

  test('renders FAQ link', () => {
    renderFooter()
    const faqLink = screen.getByText('Tickets')
    expect(faqLink).toBeInTheDocument()
    expect(faqLink).toHaveAttribute('href', '/dashboard/faq')
  })

  test('renders Account link', () => {
    renderFooter()
    const accountLink = screen.getByText('GuideBooks')
    expect(accountLink).toBeInTheDocument()
    expect(accountLink).toHaveAttribute('href', '/dashboard/account')
  })

  test('renders Documents link', () => {
    renderFooter()
    const documentsLink = screen.getByText('FAQs')
    expect(documentsLink).toBeInTheDocument()
    expect(documentsLink).toHaveAttribute('href', '/dashboard/documents')
  })

  test('renders Contact link', () => {
    renderFooter()
    const contactLink = screen.getByText('Contact')
    expect(contactLink).toBeInTheDocument()
    expect(contactLink).toHaveAttribute('href', '/dashboard/contact')
  })

  // test('renders Contact Us button', () => {
  //   renderFooter();
  //   const contactUsButton = screen.getByText('Contact Us');
  //   expect(contactUsButton).toBeInTheDocument();
  // });
})
