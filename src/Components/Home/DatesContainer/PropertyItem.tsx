import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import "../DatesContainer/Propertyitem.css";

export default function BasicSelect() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedCardIndex, setSelectedCardIndex] = React.useState(0);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // const handleCardClick = (index: number) => {
  //   setSelectedCardIndex(index);
  //   handleClose(); // Optionally close the menu when a card is selected
  // };
  // const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.stopPropagation();
  // };

  const handleNextCard = () => {
    setSelectedCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrevCard = () => {
    setSelectedCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  
  const cards = ['Blue Bear Lake', 'Crown Jewel','Blue Crown'];

  return (
    <Box sx={{ Width: 70,borderRadius: 32 }}>
      <Button
      
        aria-controls="basic-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="outlined"
        className='PropertyBtn'
        sx={
          {
            borderRadius:10,
            width:300,
            height:70,
            border:'none'
            

          }
        }
      >
        <div className="d-flex flex-column pt-3">
        <span className="DateHead1">My Home(s)  </span> 
        <p className='property1'>Select Property </p>
        </div>
     


      </Button>
      <Menu
      
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          borderRadius: 32,
          
        }}
      >
<MenuItem disableRipple 
  sx={{
    
  }}
>
<div className="CardItem">
            <div className="d-flex justify-content-between">
              <Button onClick={handlePrevCard} disabled={selectedCardIndex === 0}>Previous</Button>
              <div>
                {cards[selectedCardIndex]}
              </div>
              <Button onClick={handleNextCard} disabled={selectedCardIndex === cards.length - 1}>Next</Button>
            </div>

            <div className="card-content">

            {selectedCardIndex === 0 && (
              <div>
        <div className="d-flex justify-content-between mt-2 p-2">
          <span>
            <h4 className='BlueHead'>Blue Bear Lake</h4>
            <p className='BlueFont'>537 Blue Lake St. Garden City, UT 84078</p>
          </span>
          <span className='image1'></span>
        </div>

        <div className="d-flex justify-contetent-around p-2">
          <p className='Available'>My Available Nights</p>
          <button className='card-btn1'>2024</button>
          <button className='card-btn1'>2025</button>
          <button className='card-btn1'>2026</button>
        </div>

        <div className="box d-flex justify-content-around p-3 ">
          <div className="d-flex flex-column">
            <li>12/20</li>
            <li className='Box-list'>Off-Season Nights</li>
          </div>
          <div className="d-flex flex-column">
            <li>13/4</li>
            <li className='Box-list'>Peak-Season Nights</li>
          </div>
          <div className="d-flex flex-column">
            <li>5/34</li>
            <li className='Box-list'>Peak-Season Holiday</li>
          </div>
          <div className="d-flex flex-column">
            <li>33/13</li>
            <li className='Box-list'>Off-Season Holiday</li>
          </div>
        </div>
      </div>
    )}

    {selectedCardIndex === 1 && (
      <div>
        <div className="d-flex justify-content-between mt-2 p-2">
          <span>
            <h4 className='BlueHead'>Crown Jewel</h4>
            <p className='BlueFont'>123 Main Street, City, State 12345</p>
          </span>
          <span className='image1'></span>
        </div>

        <div className="d-flex justify-contetent-around p-2">
          <p className='Available'>My Available Nights</p>
          <button className='card-btn1'>2024</button>
          <button className='card-btn1'>2025</button>
          <button className='card-btn1'>2026</button>
        </div>

        <div className="box d-flex justify-content-around p-3">
          <div className="d-flex flex-column">
            <li>11/30</li>
            <li className='Box-list'>Off-Season Nights</li>
          </div>
          <div className="d-flex flex-column">
            <li>1/1</li>
            <li className='Box-list'>Peak-Season Nights</li>
          </div>
          <div className="d-flex flex-column">
            <li>7/14</li>
            <li className='Box-list'>Peak-Season Holiday</li>
          </div>
          <div className="d-flex flex-column">
            <li>0/1</li>
            <li className='Box-list'>Off-Season Holiday</li>
          </div>
        </div>
      </div>
    )}


{selectedCardIndex === 2 && (
      <div>
        <div className="d-flex justify-content-between mt-2 p-2">
          <span>
            <h4 className='BlueHead'>Blue Crown Jewel</h4>
            <p className='BlueFont'>123 Main Street, City, State 12345</p>
          </span>
          <span className='image1'></span>
        </div>

        <div className="d-flex justify-contetent-around p-2">
          <p className='Available'>My Available Nights</p>
          <button className='card-btn1'>2024</button>
          <button className='card-btn1'>2025</button>
          <button className='card-btn1'>2026</button>
        </div>

        <div className="box d-flex justify-content-around p-3">
          <div className="d-flex flex-column">
            <li>11/30</li>
            <li className='Box-list'>Off-Season Nights</li>
          </div>
          <div className="d-flex flex-column">
            <li>1/1</li>
            <li className='Box-list'>Peak-Season Nights</li>
          </div>
          <div className="d-flex flex-column">
            <li>7/14</li>
            <li className='Box-list'>Peak-Season Holiday</li>
          </div>
          <div className="d-flex flex-column">
            <li>0/1</li>
            <li className='Box-list'>Off-Season Holiday</li>
          </div>
        </div>
      </div>
    )}

</div>
</div>
</MenuItem>
      </Menu>
    </Box>
  );
}

