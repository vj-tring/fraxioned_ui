import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface MapEmbedProps {
  city?: string;
  state?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
}

const MapEmbed: React.FC<MapEmbedProps> = ({ city, state, country }) => {
  const [showMore, setShowMore] = useState(false);
  const houseRules = [
    "Location",
    "Lake priority - about 10-min walk to Bear Lake",
    " Nearest Supermarket - less than 5-minutes drive to Mike's Market...",
    "Please dispose of trash properly.",
    "Respect your neighbors.",
    "Keep the noise to a minimum.",
    "No parties allowed.",
  ];

  const visibleRules = showMore ? houseRules : houseRules.slice(0, 4);

  return (
    <div className="mt-4 d-flex flex-column gap-8">
      <h1 style={{ fontSize: "1.6rem", fontWeight: "bold" }}>Location</h1>

      <iframe
        title="Google Map Embed"
        width="600"
        height="550"
        style={{ border: 0, width: "100%" }}
        loading="lazy"
        allowFullScreen
        // src="https://www.google.com/maps/embed/v1/place?q=San+Francisco&key=YOUR_GOOGLE_MAPS_API_KEY"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.9964103114!2d-122.52000155037997!3d37.75780703794148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2sin!4v1724762892590!5m2!1sen!2sin"
      ></iframe>
      <div>
        <Typography
          variant="h6"
          className="ThingstoHead monsterrat mb-2"
          gutterBottom
        >
          {city}, {state}, {country}
        </Typography>
        <div>
          <ul>
            {visibleRules.map((rule, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "8px",
                  fontFamily: " Montserrat, sans-serif",
                  fontSize: "initial ",
                  fontWeight: "400 ",
                  color: "black",
                }}
                className="monsterrat RuleList"
              >
                {rule}
              </li>
            ))}
          </ul>

          <Button
            variant="text"
            color="primary"
            onClick={() => setShowMore(!showMore)}
            style={{
              fontSize: "14px",
              textDecoration: "underline",
              textTransform: "capitalize",
              color: "black",
              fontWeight: "600",
              margin: 0,
              padding: 0,
            }}
            className="monsterrat mt-4"
          >
            {showMore ? "< Show Less " : "Show more >"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapEmbed;
