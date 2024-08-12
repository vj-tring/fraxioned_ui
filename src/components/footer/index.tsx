import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './footer.css'

const Footer: React.FC = () => {
  return (
    <div className="footer d-flex">
        <div className="col-md-4 mt-1">
          <div className="logo"></div>
        </div>
        <div className="col-md-2 mt-3">
          <ul>
            <li>
              <Link to="/dashboard" className="no-underline disabled">
                Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard/booking" className="no-underline disabled">
                Booking
              </Link>
            </li>
            <li>
              <Link to="/dashboard/peak-season" className="no-underline disabled">
                Peak Season
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-2">
          <ul>
            <li>
              <Link to="/dashboard/payments" className="no-underline disabled">
                Payments
              </Link>
            </li>
            <li>
              <Link to="/dashboard/faq" className="no-underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/dashboard/account" className="no-underline disabled">
                Account
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-2 mt-3">
          <ul>
            <li>
              <Link to="/dashboard/documents" className="no-underline disabled">
                Documents
              </Link>
            </li>
            <li>
              <Link to="/dashboard/contact" className="no-underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/account" className="no-underline disabled">
                GuideBooks
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-2 mt-3">
          <ul>
            <li>
              <Link to="/documents" className="no-underline disabled">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/contact" className="no-underline disabled">
                Contact Us
              </Link>
            </li>
            <li>
              <a href="https://www.fraxioned.com/" className="no-underline disabled ">
               My Account
              </a>
            </li>
          </ul>
        </div>
        <div className="col-md-7 mt-5 Footlink ">
          <ul>
            <li>
              <a href="https://www.fraxioned.com/"  target='_blank' className="no-underline" rel="noreferrer">
                fraxioned.com
              </a>
            </li>
        
          </ul>
        </div>
    </div>
  )
}

export default Footer
