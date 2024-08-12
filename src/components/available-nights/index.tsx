/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import './available-night.css';
import userImage from '../../assets/images/profile.jpeg'
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

export default function AvailableNights() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0)
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [years, setYears] = useState<number[]>([2024, 2025, 2026])
  const [selectedYear, setSelectedYear] = useState<number>(2024)

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


  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };


  return (
    <Box >
    

      
          <MenuItem disableRipple>
            <div className="CardItem1 monsterrat ">
              {selectedCard && (
                <div className="card-content">
                  <div className="d-flex justify-content-between   mb-2">
                    <span>
                      <h4 className="BlueHead2">Your 1/4 share</h4>
                    </span>
                    <div className="ProfileImageContainer">
              <img
                src={userImage} 
                alt="Profile"
                className="ProfileImage"
              />
            </div>                  </div>
                  <div className="d-flex justify-content-around p-2">
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

                  <div className="box1 d-flex justify-content-around p-3 mb-3">
                    <div className="d-flex flex-column">
                      <li>
                        {selectedCard.details[selectedYear]?.offSeason || 'N/A'}
                      </li>
                      <li className="Box-list1">Off-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.peakSeason || 'N/A'}
                      </li>
                      <li className="Box-list1">Peak-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.peakHoliday || 'N/A'}
                      </li>
                      <li className="Box-list1">Peak-Season Holiday</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.offSeasonHoliday || 'N/A'}
                      </li>
                      <li className="Box-list1">Off-Season Holiday</li>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </MenuItem>
 
    </Box>
  );
}
