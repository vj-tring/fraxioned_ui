import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import '../DatesContainer/Propertyitem.css'

interface Card {
  id: number
  name: string
  address: string
  details: {
    offSeason: string
    peakSeason: string
    peakHoliday: string
    offSeasonHoliday: string
  }
}

export default function BasicSelect() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0)
  const [cards, setCards] = useState<Card[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      // Simulating an API call
      const cardData: Card[] = [
        {
          id: 1,
          name: 'Blue Bear Lake',
          address: '537 Blue Lake St. Garden City, UT 84078',
          details: {
            offSeason: '12/20',
            peakSeason: '13/4',
            peakHoliday: '5/34',
            offSeasonHoliday: '33/13',
          },
        },
        {
          id: 2,
          name: 'Crown Jewel',
          address: '123 Main Street, City, State 12345',
          details: {
            offSeason: '11/30',
            peakSeason: '1/1',
            peakHoliday: '7/14',
            offSeasonHoliday: '0/1',
          },
        },
        {
          id: 3,
          name: 'Blue Crown Jewel',
          address: '123 Main Street, City, State 12345',
          details: {
            offSeason: '11/30',
            peakSeason: '1/1',
            peakHoliday: '7/14',
            offSeasonHoliday: '0/1',
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // const handleCardClick = (cardId: number) => {
  //     const index = cards.findIndex((card) => card.id === cardId)
  //     setSelectedCardIndex(index)
  //     handleClose()
  // }

  const handleNextCard = () => {
    setSelectedCardIndex((prevIndex) => (prevIndex + 1) % cards.length)
  }

  const handlePrevCard = () => {
    setSelectedCardIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    )
  }

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        handleClose() // Close menu on scroll
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [open])

  return (
    <Box sx={{ width: 280, borderRadius: 32 }}>
      <Button
        aria-controls="basic-menu"
        aria-haspopup="true"
        onClick={handleClick}
        variant="outlined"
        className="PropertyBtn"
        sx={{
          borderRadius: 10,
          width: 275,
          height: 70,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div className="d-flex flex-column pt-3">
          <span className="DateHead1">My Home(s)</span>
          <p className="property1">
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
            position: 'fixed', // Ensure the menu stays fixed
            //    transform: 'translateY(10px)', // Ensure menu doesn't shift when scrolling
            //    top:300,
          },
        }}
        sx={{
          borderRadius: 32,
        }}
      >
        {cards.length > 0 && (
          <MenuItem disableRipple>
            <div className="CardItem">
              <div className="d-flex justify-content-between IconArrow">
                <Button
                  onClick={handlePrevCard}
                  disabled={selectedCardIndex === 0}
                >
                  <FontAwesomeIcon icon={faArrowLeft} />

                  {/* <FontAwesomeIcon icon={faArrowLeft as IconProp} /> */}
                </Button>

                <h4 className="BlueHead1">{selectedCard?.name}</h4>
                <Button
                  onClick={handleNextCard}
                  disabled={selectedCardIndex === cards.length - 1}
                >
                  <FontAwesomeIcon icon={faArrowRight} />
                </Button>
              </div>

              {selectedCard && (
                <div className="card-content">
                  <div className="d-flex justify-content-between mt-1 p-2">
                    <span>
                      <h4 className="BlueHead">{selectedCard.name}</h4>
                      <p className="BlueFont">{selectedCard.address}</p>
                    </span>
                    <span className="image1"></span>
                  </div>
                  <div className="d-flex justify-content-around p-2">
                    <p className="Available">My Available Nights</p>
                    <button className="card-btn1">2024</button>
                    <button className="card-btn1">2025</button>
                    <button className="card-btn1">2026</button>
                  </div>

                  <div className="box d-flex justify-content-around p-3">
                    <div className="d-flex flex-column">
                      <li>{selectedCard.details.offSeason}</li>
                      <li className="Box-list">Off-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column">
                      <li>{selectedCard.details.peakSeason}</li>
                      <li className="Box-list">Peak-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column">
                      <li>{selectedCard.details.peakHoliday}</li>
                      <li className="Box-list">Peak-Season Holiday</li>
                    </div>
                    <div className="d-flex flex-column">
                      <li>{selectedCard.details.offSeasonHoliday}</li>
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
  )
}
