import React from 'react';
import CustomNavbar from '../Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import fraxionedLogo from '../../assets/Fraxioned.png';
import Footer from '../../Footer/Footer';
import userImage from '../../assets/user.png'; // Import the user image

const Dashboard: React.FC = () => {
  const links = [
    { name: 'HOME', href: '/'},
    { name: 'BOOKING', href: '/about' },
    { name: 'PEAK SEASON', href: '/services' },
    { name: 'PAYMENTS', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
  ];

  return (
    <div>
      <CustomNavbar
        logo={fraxionedLogo} 
        links={links}
        userImage={userImage} // Pass the user image
        userName="John Doe"
      />
      <Footer />
    </div>
  );
}

export default Dashboard;
