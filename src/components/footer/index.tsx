import React from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './footer.css'

const Footer: React.FC = () => {
  return (
    <div className="footer d-flex justify-content-between align-items-center px-7">
      <div className="logo"></div>
      <div className='d-flex foot-gap text-left'>
        <div>
          <ul>
            <li>
              <Link to="/home" className="no-underline disabled">
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
        <div>
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
        <div>
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

      </div>

      <div>
        <ul>
          <li>
            <a href="https://www.fraxioned.com/" target='_blank' className="no-underline" rel="noreferrer">
              fraxioned.com
            </a>
          </li>

        </ul>
      </div>
    </div>
  )
}

export default Footer