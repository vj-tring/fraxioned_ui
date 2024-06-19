import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className='footer'>
      <div className='row'>
        <div className='col-md-3'>
          <div className='logo'></div>
        </div>
        <div className='col-md-2'>
          <ul>
            <li><Link to='/' className='no-underline'>Home</Link></li>
            <li><Link to='/dashboard/booking' className='no-underline disabled'>Booking</Link></li>
            <li><Link to='/dashboard/peak-season' className='no-underline disabled'>Peak Season</Link></li>
          </ul>
        </div>
        <div className='col-md-2'>
          <ul>
            <li><Link to='/dashboard/payments' className='no-underline disabled'>Payments</Link></li>
            <li><Link to='/dashboard/faq' className='no-underline'>FAQ</Link></li>
            <li><Link to='/dashboard/account' className='no-underline disabled'>Account</Link></li>
          </ul>
        </div>
        <div className='col-md-2'>
          <ul>
            <li><Link to='/dashboard/documents' className='no-underline disabled'>Documents</Link></li>
            <li><Link to='/dashboard/contact' className='no-underline'>Contact</Link></li>
            <li><Link to='https://www.fraxioned.com/' className='no-underline'>fraxioned.com</Link></li>
          </ul>
        </div>
        <div className='col-md-3'><a href='/dashboard/contact'> 
        <button className='contact-us'> Contact Us <span className="arrow">&#8594;</span></button>
        </a>
</div>
      </div>
    </footer>
  );
};

export default Footer;
