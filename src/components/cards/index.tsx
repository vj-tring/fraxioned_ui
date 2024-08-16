import React from "react";
import { useNavigate } from "react-router-dom";
import "./card.css";
import { FaPlus } from "react-icons/fa";
import FraxImg from "../../assests/lake-escape.jpg";
interface CardProps {
  imageUrl: string;
  text: string;
  title: string;
  share?: string;
  id?: number;
  showPlusIcon?: boolean; // New prop to control visibility of the plus icon
}

const Card: React.FC<CardProps> = ({
  imageUrl,
  text,
  title,
  share,
  showPlusIcon,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard/booking");
  };

  return (
    <>
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

      {showPlusIcon && (
        <div className="plus-icon-container">
        <div className="image-container ">
          <img
            src={FraxImg}
            className={`card-img-top ${showPlusIcon ? 'blur-effect' : ''}`}
            alt={title}
          />
                  {showPlusIcon && <FaPlus className="plus-icon" />}
                  </div>
          <div className="card-body ">
            <h4 className="card-title">Adventure Awaits...</h4>
            <span className="card-text">Discoverd your next Fraxioned home at fraxioned.com</span>
          </div>
          
        </div>
      )}
    </>
  );
};

export default Card;
