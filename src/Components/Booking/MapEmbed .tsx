import React, { useState } from 'react';
import {  Typography, Button } from '@mui/material'; // Updated import for Material-UI components


const MapEmbed = () => {

    const [showMore, setShowMore] = useState(false);
    const houseRules = [
        "Location",
        "Lake priority - about 10-min walk to Bear Lake",
        " Nearest Supermarket - less than 5-minutes drive to Mike's Market...",
        "Please dispose of trash properly.",
        "Respect your neighbors.",
        "Keep the noise to a minimum.",
        "No parties allowed."
      ];
    
    const visibleRules = showMore ? houseRules : houseRules.slice(0, 4);
    
  return (
    <div style={{ padding: '16px' }}>
      <h2 className='mb-4 mt-1'>Location</h2>
      <iframe
        title="Google Map Embed"
        width="600"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        src="https://www.google.com/maps/embed/v1/place?q=San+Francisco&key=YOUR_GOOGLE_MAPS_API_KEY"
      ></iframe>
       <div className='mt-4'>
      <Typography variant="h6" className='ThingstoHead monsterrat' gutterBottom>Garden city, Utah, United States</Typography>
      <Typography variant="body1" paragraph>
      <ul>
      {visibleRules.map((rule, index) => (
            <li key={index} style={{ marginBottom: '8px',

              fontFamily:' Montserrat, sans-serif',
              fontSize: 'initial ',
              fontWeight: '400 ',
              color: 'black' ,
              
            }} className='monsterrat '>{rule}</li>
          ))}
        </ul>
     
        <Button
          variant="text"
          color="primary"
          onClick={() => setShowMore(!showMore)}
          style={{ fontSize: '14px',
            textDecoration: 'underline',
            textTransform: 'capitalize',
            color: 'black',
            fontWeight:'600',
            margin:0,
            padding:0

           }}
           className='monsterrat'

        >
          {showMore ? '< Show Less ' : 'Show More >'}
        </Button>
       
      </Typography>
    </div>
    </div>
    
  );
};

export default MapEmbed;