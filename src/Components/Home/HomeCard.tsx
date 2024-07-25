import React from 'react';
import { Button } from 'react-bootstrap';
import { FaMapMarkerAlt } from 'react-icons/fa';
import './HomeCard.css';

interface HomeCardProps {
  image: string;
  title: string;
  address: string;
  share: string;
  buttonText: string;
}

const HomeCard: React.FC<HomeCardProps> = ({ image, title, address, share, buttonText }) => {
  return (
    <div className="home-info">
      <div className="home-image-container">
        <img src={image} alt={title} className="home-image" />
      </div>
      <div className="home-details">
        <h3 className='home-items'>
          <FaMapMarkerAlt /> 
          <div className="d-flex flex-column imgtxt">
            <span className='title'>{title}</span>
          <h6 className="address">{address}</h6>
          </div>
        </h3>

      
        <p className="share">YOU OWN <b>{share}</b> SHARE</p>
        <Button variant="warning" className="book-stay-btn">
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default HomeCard;
  

