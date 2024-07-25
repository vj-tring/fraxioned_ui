import React from 'react';
import "../../Home/Cards/Card.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface CardProps {
    imageUrl: string;
    text: string;
    title: string;
    share?: string;
    id?: number; // Add id property
}

const Card: React.FC<CardProps> = ({ imageUrl, text, title, share, id }) => {
    const cardStyle = id ? "card3 blur-effect" : "card3";

    return (
        <div className={cardStyle}>
            <div className="image-container">
                <img src={imageUrl} className="card-img-top" alt="..." />
                
                {id && <FontAwesomeIcon icon={faPlus}  className='plus-icon'/>
            }
            </div>
            <div className="card-body">
                <h4 className="card-title">{title}</h4>
                <h6 className="card-text">{text}</h6>
                <h6 className="share">{share}</h6>
            </div>
        </div>
    );
};

export default Card;