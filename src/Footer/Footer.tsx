import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Footer.css'

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
              <Link to="/booking" className="no-underline disabled">
                Bookings
              </Link>
            </li>
            <li>
              <Link to="/peak-season" className="no-underline disabled">
                Payments
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-md-2 mt-3">
          <ul>
            <li>
              <Link to="/payments" className="no-underline disabled">
                Documents
              </Link>
            </li>
            <li>
              <Link to="/faq" className="no-underline disabled">
                Tickets
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
        <div className="col-md-2 mt-3">
          <ul>
            <li>
              <a href="https://www.fraxioned.com/"  target='_blank' className="no-underline " rel="noreferrer">
                fraxioned.com
              </a>
            </li>
        
          </ul>
        </div>
    </div>
  )
}

export default Footer
