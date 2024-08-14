import React from 'react'
import './card.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaPlus } from 'react-icons/fa'

interface CardProps {
  imageUrl: string
  text: string
  title: string
  share?: string
  id?: number
}

const Card: React.FC<CardProps> = ({ imageUrl, text, title, share, id }) => {
  const cardStyle = id ? 'card3 blur-effect' : 'card3'

  return (
    <div className={cardStyle}>
      <div className="image-container">
        <img src={imageUrl} className="card-img-top" alt="..." />

        {id && <FaPlus className="plus-icon" />}
      </div>
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <span className="card-text mt-0">{text}</span>
        <h6 className="share mt-0">{share}</h6>
      </div>
    </div>
  )
}

export default Card
