/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import './available-night.css';
import userImage from '../../assets/images/profile.jpeg'
interface Card {
  id: number
  name: string
  address: string
  details: {
    [year: number]: {
      offSeason: string
      peakSeason: string
      peakHoliday: string
      offSeasonHoliday: string
    }
  }
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
          address: '537 Blue Lake St. Garden City, UT 84078',
          details: {
            2024: {
              offSeason: '12/20',
              peakSeason: '13/4',
              peakHoliday: '5/34',
              offSeasonHoliday: '33/13',
            },
            2025: {
              offSeason: '11/15',
              peakSeason: '12/5',
              peakHoliday: '4/25',
              offSeasonHoliday: '30/10',
            },
            2026: {
              offSeason: '10/10',
              peakSeason: '11/1',
              peakHoliday: '6/20',
              offSeasonHoliday: '28/12',
            },
          },
        },

        {
          id: 2,
          name: 'Crown Jewel',
          address: '123 Main Street, City, State 12345',
          details: {
            2024: {
              offSeason: '10/10',
              peakSeason: '11/1',
              peakHoliday: '6/20',
              offSeasonHoliday: '28/12',
            },
            2025: {
              offSeason: '12/20',
              peakSeason: '13/4',
              peakHoliday: '5/34',
              offSeasonHoliday: '33/13',
            },
            2026: {
              offSeason: '11/15',
              peakSeason: '12/5',
              peakHoliday: '4/25',
              offSeasonHoliday: '30/10',
            },
          },
        },

        {
          id: 3,
          name: 'Crown Blue',
          address: '432 Crown BLue St. Garden City, UT 84078',
          details: {
            2024: {
              offSeason: '22/30',
              peakSeason: '13/2',
              peakHoliday: '5/44',
              offSeasonHoliday: '23/33',
            },
            2025: {
              offSeason: '11/15',
              peakSeason: '12/5',
              peakHoliday: '4/25',
              offSeasonHoliday: '30/10',
            },
            2026: {
              offSeason: '10/10',
              peakSeason: '11/1',
              peakHoliday: '6/20',
              offSeasonHoliday: '28/12',
            },
          },
        },
        {
          id: 4,
          name: 'Jewel Blue',
          address: '432 Crown BLue St. Garden City, UT 84078',
          details: {
            2024: {
              offSeason: '22/30',
              peakSeason: '13/2',
              peakHoliday: '5/44',
              offSeasonHoliday: '23/33',
            },
            2025: {
              offSeason: '11/15',
              peakSeason: '12/5',
              peakHoliday: '4/25',
              offSeasonHoliday: '30/10',
            },
            2026: {
              offSeason: '10/10',
              peakSeason: '11/1',
              peakHoliday: '6/20',
              offSeasonHoliday: '28/12',
            },
          },
        },
      ]
      setCards(cardData)
      setSelectedCardIndex(0)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (cards.length > 0 && selectedCardIndex >= 0) {
      setSelectedCard(cards[selectedCardIndex])
    } else {
      setSelectedCard(null)
    }
  }, [selectedCardIndex, cards])



  const handleYearClick = (year: number) => {
    setSelectedYear(year)
  }


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

                  <div className="box1 d-flex justify-content-around p-3 mb-3">
                    <div className="d-flex flex-column">
                      <li>
                        {selectedCard.details[selectedYear]?.offSeason || 'N/A'}
                      </li>
                      <li className="Box-list1">Off-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column">
                      <li>
                        {selectedCard.details[selectedYear]?.peakSeason ||
                          'N/A'}
                      </li>
                      <li className="Box-list1">Peak-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column">
                      <li>
                        {selectedCard.details[selectedYear]?.peakHoliday ||
                          'N/A'}
                      </li>
                      <li className="Box-list1">Peak-Season Holiday</li>
                    </div>
                    <div className="d-flex flex-column">
                      <li>
                        {selectedCard.details[selectedYear]?.offSeasonHoliday ||
                          'N/A'}
                      </li>
                      <li className="Box-list1">Off-Season Holiday</li>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </MenuItem>
 
    </Box>
  )
}
