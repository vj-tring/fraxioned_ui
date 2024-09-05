
import React from "react";
import { useNavigate } from "react-router-dom";
import "./card.css";

interface CardProps {
  imageUrl: string;
  text: string;
  title: string;
  share?: string;
  id?: number;
  showPlusIcon?: boolean; 
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  text,
  title,
  share,
  id,

  showPlusIcon,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (id !== undefined) {
      navigate(`/home/property/${id}`);
    }
  };



  return (
    
    <div
      className={`card3 ${showPlusIcon ? "static-card" : ""}`}
      onClick={handleClick}
    >
      <div className="image-container">
        <img src={imageUrl} className="card-img-top" alt={title} />
      </div>

      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <span className="card-text">{text}</span>
        <h6 className="share mt-0">{share}</h6>
      </div>

    </div>
    
  );
};

export default Card;
