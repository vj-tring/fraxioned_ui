import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import '../DatesContainer/Propertyitem.css';
import image1 from '../../../assets/Property_Images/Blue bear lake.jpg';
import image2 from '../../../assets/Property_Images/crown jewel.jpg';
import image3 from '../../../assets/Property_Images/lake escape.jpg';
import image4 from '../../../assets/Property_Images/Bear Lake bluffs.jpg';

interface Card {
  id: number;
  name: string;
  address: string;
  image: string;
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
  const [years] = useState<number[]>([2024, 2025, 2026]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const carouselRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchData = async () => {
      const cardData: Card[] = [
        {
          id: 1,
          name: 'Blue Bear Lake',
          address: '537 Blue Lake St, Garden City, Utah, United States, 84028',
          image: image1,
          details: {
            2024: { offSeason: '12/30', peakSeason: '1/14', peakHoliday: '0/1', offSeasonHoliday: '0/1' },
            2025: { offSeason: '8/30', peakSeason: '14/14', peakHoliday: '1/1', offSeasonHoliday: '0/1' },
            2026: { offSeason: '8/30', peakSeason: '3/14', peakHoliday: '1/1', offSeasonHoliday: '1/1' },
          },
        },
        {
          id: 2,
          name: 'The Crown Jewel',
          address: '5409 South Aquamarine Lane, St. George, Utah, United States, 84790',
          image: image2,
          details: {
            2024: { offSeason: '10/30', peakSeason: '11/14', peakHoliday: '0/1', offSeasonHoliday: '0/1' },
            2025: { offSeason: '7/30', peakSeason: '8/14', peakHoliday: '1/1', offSeasonHoliday: '0/1' },
            2026: { offSeason: '23/30', peakSeason: '2/14', peakHoliday: '0/1', offSeasonHoliday: '1/1' },
          },
        },
        {
          id: 3,
          name: 'Bear Lake Bluffs',
          address: '732 Spruce Drive, Garden City, Utah, United States, 84028',
          image: image3,
          details: {
            2024: { offSeason: '25/30', peakSeason: '1/14', peakHoliday: '1/1', offSeasonHoliday: '0/1' },
            2025: { offSeason: '22/30', peakSeason: '13/14', peakHoliday: '0/1', offSeasonHoliday: '0/1' },
            2026: { offSeason: '25/30', peakSeason: '12/14', peakHoliday: '1/1', offSeasonHoliday: '0/1' },
          },
        },
        {
          id: 4,
          name: 'Lake Escape',
          address: '432 Crown Blue St, Garden City, UT 84078',
          image: image4,
          details: {
            2024: { offSeason: '11/30', peakSeason: '13/14', peakHoliday: '1/1', offSeasonHoliday: '0/1' },
            2025: { offSeason: '21/30', peakSeason: '3/14', peakHoliday: '0/1', offSeasonHoliday: '1/1' },
            2026: { offSeason: '23/30', peakSeason: '3/14', peakHoliday: '1/1', offSeasonHoliday: '0/1' },
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

  useEffect(() => {
    if (carouselRef.current) {
      const selectedElement = carouselRef.current.children[selectedCardIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedCardIndex]);

  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };

  const handlePrevious = () => {
    const newIndex = Math.max(selectedCardIndex - 1, 0);
    setSelectedCardIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(selectedCardIndex + 1, cards.length - 1);
    setSelectedCardIndex(newIndex);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  // Determine if the carousel should be shown
  const showCarousel = cards.length >1;
  const showCarouselControls = cards.length > 1;

  // Set the width of CardItem based on the number of cards
  const cardItemWidth = cards.length === 2 ? '370px' : '460px';

  return (
    <Box sx={{ width: 300, borderRadius: 32, border: 'none' }}>
      <Button
        disableRipple
        aria-controls="basic-menu"
        aria-haspopup="true"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className="PropertyBtn"
        sx={{
          borderRadius: 10,
          width: 275,
          height: 70,
          border: 'none',
          cursor: 'pointer',
          paddingRight: 10,
          position: 'relative',
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
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            position: 'fixed',
            maxHeight: '60vh',
            overflowY: 'auto',
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
            <div className="CardItem py-2" style={{ width: cardItemWidth }}>
              {showCarousel && (
                <div className="card-container">
                  <div className="d-flex flex-row">
                    {showCarouselControls && (
                      <IconButton onClick={handlePrevious} disableRipple sx={{ padding: 0 }} disabled={selectedCardIndex === 0}>
                        <NavigateBeforeIcon />
                      </IconButton>
                    )}
                    <div className="d-flex flex-row w-100 " style={{ overflowX: 'auto', whiteSpace: 'nowrap',justifyContent:'space-evenly' }} ref={carouselRef}>
                      {cards.map((card, index) => (
                        <Button
                          key={card.id}
                          disableRipple
                          className={`additionalproperty ${selectedCardIndex === index ? 'active' : ''}`}
                          onClick={() => handleCardClick(index)}
                          sx={{
                            flex: '0 0 auto',
                            margin: '4px',
                            padding: '8px',
                          }}
                        >
                          <div className="d-flex flex-column align-items-center">
                            <span className="property-name">{card.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                    {showCarouselControls && (
                      <IconButton onClick={handleNext} disableRipple disabled={selectedCardIndex === cards.length - 1} sx={{ padding: 0 }}>
                        <NavigateNextIcon />
                      </IconButton>
                    )}
                  </div>
                </div>
              )}

              {selectedCard && (
                <div className="card-content">
                  {cards.length > 1 && showCarousel && (
                    <div className="dots-container">
                      {cards.map((_, index) => (
                        <div
                          key={index}
                          className={`dot ${index === selectedCardIndex ? 'active' : ''}`}
                          onClick={() => handleCardClick(index)}
                        ></div>
                      ))}
                    </div>
                  )}
                  <div className="card-name d-flex justify-content-between py-2 align-items-center gy-1">
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

                  <div className="box d-flex justify-content-around py-1 ">
                    <div className="d-flex flex-column night-count">
                      <li>{selectedCard.details[selectedYear]?.offSeason || 'N/A'}</li>
                      <li className="Box-list">Off-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>{selectedCard.details[selectedYear]?.peakSeason || 'N/A'}</li>
                      <li className="Box-list">Peak-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>{selectedCard.details[selectedYear]?.peakHoliday || 'N/A'}</li>
                      <li className="Box-list">Peak-Season Holiday</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>{selectedCard.details[selectedYear]?.offSeasonHoliday || 'N/A'}</li>
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
