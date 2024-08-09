/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import './propertycarousel.css';
import image1 from '../../assets/images/bookings-page-banner.jpg';
import image2 from '../../assets/images/home-page-banner.jpg';
import image3 from '../../assets/images/bedroom1.jpg';
import image4 from '../../assets/images/bookings-page-banner.jpg';
interface Card {
  id: number;
  name: string;
  address: string;
  image: string; // Added image property
  details: {
    [year: number]: {
      offSeason: string;
      peakSeason: string;
      peakHoliday: string;
      offSeasonHoliday: string;
    };
  };
}

export default function BasicSelect() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [years, setYears] = useState<number[]>([2024, 2025, 2026]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  useEffect(() => {
    const fetchData = async () => {
      const cardData: Card[] = [
        {
          id: 1,
          name: 'Blue Bear Lake',
          address: '537 Blue Lake St, Garden City, Utah, United States, 84028',
          image: image1, // Added image URL
          details: {
            2024: {
              offSeason: '12/30',
              peakSeason: '1/14',
              peakHoliday: '0/1',
              offSeasonHoliday: '0/1',
            },
            2025: {
              offSeason: '8/30',
              peakSeason: '14/14',
              peakHoliday: '1/1',
              offSeasonHoliday: '0/1',
            },
            2026: {
              offSeason: '8/30',
              peakSeason: '3/14',
              peakHoliday: '1/1',
              offSeasonHoliday: '1/1',
            },
          },
        },
        {
          id: 2,
          name: 'The Crown Jewel',
          address: '5409 South Aquamarine Lane, St. George, Utah, United States, 84790',
          image:image2, // Added image URL
          details: {
            2024: {
              offSeason: '10/30',
              peakSeason: '11/14',
              peakHoliday: '0/1',
              offSeasonHoliday: '0/1',
            },
            2025: {
              offSeason: '7/30',
              peakSeason: '8/14',
              peakHoliday: '1/1',
              offSeasonHoliday: '0/1',
            },
            2026: {
              offSeason: '23/30',
              peakSeason: '2/14',
              peakHoliday: '0/1',
              offSeasonHoliday: '1/1',
            },
          },
        },
        {
          id: 3,
          name: 'Bear Lake Bluffs',
          address: '732 Spruce Drive, Garden City, Utah, United States, 84028',
          image: image3, // Added image URL
          details: {
            2024: {
              offSeason: '25/30',
              peakSeason: '1/14',
              peakHoliday: '1/1',
              offSeasonHoliday: '0/1',
            },
            2025: {
              offSeason: '22/30',
              peakSeason: '13/14',
              peakHoliday: '0/1',
              offSeasonHoliday: '0/1',
            },
            2026: {
              offSeason: '25/30',
              peakSeason: '12/14',
              peakHoliday: '1/1',
              offSeasonHoliday: '0/1',
            },
          },
        },
        {
          id: 4,
          name: 'Lake Escape',
          address: '432 Crown Blue St, Garden City, UT 84078',
          image: image4, // Added image URL
          details: {
            2024: {
              offSeason: '11/30',
              peakSeason: '13/14',
              peakHoliday: '1/1',
              offSeasonHoliday: '0/1',
            },
            2025: {
              offSeason: '21/30',
              peakSeason: '3/14',
              peakHoliday: '0/1',
              offSeasonHoliday: '1/1',
            },
            2026: {
              offSeason: '23/30',
              peakSeason: '3/14',
              peakHoliday: '1/1',
              offSeasonHoliday: '0/1',
            },
          },
        },
      ];
      setCards(cardData);
      setSelectedCardIndex(0);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (cards.length > 0 && selectedCardIndex >= 0) {
      setSelectedCard(cards[selectedCardIndex]);
    } else {
      setSelectedCard(null);
    }
  }, [selectedCardIndex, cards]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNextCard = () => {
    setSelectedCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const handlePrevCard = () => {
    setSelectedCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        handleClose();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open]);

  return (


    <Box sx={{ width: 280, borderRadius: 32, border: 'none' }}>
      <Button disableRipple
        aria-controls="basic-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="PropertyBtn"
        sx={{
          borderRadius: 10,
          width: 275,
          height: 70,
          border: 'none',
          cursor: 'pointer',
          paddingRight: 10
        }}
      >
        <div className="d-flex align-items-start flex-column pt-3 card-item">
          <span className="DateHead1 monsterrat">My Home(s)</span>
          <p className="property1 monsterrat">
            {selectedCard ? selectedCard.name : 'Select Property'}
          </p>
        </div>
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            position: 'fixed',
          },
        }}
        sx={{
          borderRadius: 32,
        }}
      >
        {cards.length > 0 && (
          <MenuItem disableRipple sx={{
            '&:hover': {
              backgroundColor: 'white !important'
            }
          }}>
            <div className="CardItem py-2">
              <div className="d-flex justify-content-between IconArrow">
                <Button disableRipple className="currentproperty" onClick={handlePrevCard} disabled={selectedCardIndex === 0}>{selectedCard?.name}</Button>
                <Button disableRipple className="nextproperty" onClick={handleNextCard} disabled={selectedCardIndex === cards.length - 1}>{!(selectedCardIndex === cards.length - 1) ? cards[(selectedCardIndex + 1) % cards.length].name : 'Completed'}</Button>
              </div>

              {selectedCard && (
                <div className="card-content">
                  <div className="card-name d-flex justify-content-between mt-1 py-2 align-items-center gy-1">
                    <span className='CardFont'>
                      <h4 className="BlueHead">{selectedCard.name}</h4>
                      <p className="BlueFont">{selectedCard.address}</p>
                    </span>
                   <span className='CardImage'>
                   <img src={selectedCard.image} alt={selectedCard.name} className="property-image" />
                   </span>
                  
                  </div>
                  <div className="d-flex justify-content-between py-2 align-items-center pt-0">
                    <p className="Available">My Available Nights</p>
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      {years.map((year) => (
                        <button
                          key={year}
                          className={`card-btn1 ${selectedYear === year ? 'active' : ''}`}
                          onClick={() => handleYearClick(year)}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="box d-flex justify-content-around py-2 ">
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.offSeason || 'N/A'}
                      </li>
                      <li className="Box-list">Off-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.peakSeason || 'N/A'}
                      </li>
                      <li className="Box-list">Peak-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.peakHoliday || 'N/A'}
                      </li>
                      <li className="Box-list">Peak-Season Holiday</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.offSeasonHoliday || 'N/A'}
                      </li>
                      <li className="Box-list">Off-Season Holiday</li>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
}
