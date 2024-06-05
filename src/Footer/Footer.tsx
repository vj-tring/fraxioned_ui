import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
        <div className='row'>
          <div className='col-md-3'>
          <div className='logo'></div>
          {/* <p className='footer-text'>Owners Portal</p> */}
          </div>
          <div className='col-md-2'>
            <ul>
              <li><a href='/' className='no-underline'>Home</a></li>
              <li><a href='/booking' className='no-underline'>Booking</a></li>
              <li><a href='/peak-season' className='no-underline'>Peak Season</a></li>
            </ul>
          </div>
          <div className='col-md-2'>
            <ul>
              <li><a href='/payments' className='no-underline'>Payments</a></li>
              <li><a href='/faq' className='no-underline'>FAQ</a></li>
              <li><a href='/account' className='no-underline'>Account</a></li>
            </ul>
          </div>
          <div className='col-md-2'>
            <ul>
              <li><a href='/documents' className='no-underline'>Documents</a></li>
              <li><a href='/contact' className='no-underline'>Contact</a></li>
              {/* <li><a href='fraxioned.com'>fraxioned.com</a></li> */}
            </ul>
          </div>
          <div className='col-md-3'>
          <button className='contact-us'>Contact Us</button>
          </div>
        </div>
    </footer>
  );
};

export default Footer;
