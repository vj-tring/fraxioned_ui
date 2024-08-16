import React from 'react';
import { useNavigate } from 'react-router-dom';
import './card.css';
import { FaPlus } from 'react-icons/fa';

interface CardProps {
  imageUrl: string;
  text: string;
  title: string;
  share?: string;
  id?: number;
  showPlusIcon?: boolean;  // New prop to control the plus icon visibility
}

const Card: React.FC<CardProps> = ({ imageUrl, text, title, share, id, showPlusIcon }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard/booking');
  };

  return (
    <div className='card3' onClick={handleClick}>
      <div className="image-container">
        <img
          src={imageUrl}
          className={`card-img-top ${showPlusIcon ? 'blur-effect' : ''}`}
          alt={title}
        />
        {showPlusIcon && <FaPlus className="plus-icon" />}
      </div>
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <span className="card-text ">{text}</span>
        <h6 className="share mt-0">{share}</h6>
      </div>
    </div>
  );
};

export default Card;
