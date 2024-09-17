import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Skeleton } from "@mui/material";
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    if (id !== undefined) {
      navigate(`/home/property/${id}`);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <Box
      className={`card3 ${showPlusIcon ? "static-card" : ""}`}
      onClick={handleClick}
    >
      <Box sx={{ position: "relative", width: "100%", height: 200 }}>
        {loading && (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        )}
        <div className="image-container">
          <img
            src={imageUrl}
            alt={title}
            onLoad={handleImageLoad}
            className="card-img-top"
            style={{
              display: loading ? "none" : "block",
              objectFit: "cover",
            }}
          />
        </div>
      </Box>

      <Box sx={{}}>
        {loading ? (
          <>
            <Skeleton width="60%" height={20} />
            <Skeleton width="80%" height={16} sx={{ mt: 1 }} />
            <Skeleton width="40%" height={16} sx={{ mt: 1 }} />
          </>
        ) : (
          <div className="card-body ">
            <Typography variant="" className="card-title monsterrat">
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              className="card-text monsterrat"
            >
              {text}
            </Typography>
            {share && (
              <Typography
                variant="caption"
                color="textSecondary"
                className="share mt-0 monsterrat"
              >
                {share}
              </Typography>
            )}
          </div>
        )}
      </Box>
    </Box>
  );
};

export default Card;