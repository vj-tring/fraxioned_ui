/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import "./available-night.css";
import image1 from "../../assests/blue-bear-lake.jpg";
import image2 from "../../assests/bear-lake-bluffs.jpg";
import image3 from "../../assests/crown-jewel.jpg";
import image4 from "../../assests/lake-escape.jpg";
import userImage from "../../assets/images/profile.jpeg";
import { RootState } from '../../store/reducers';
import { AppDispatch } from '../../store/index';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

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
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [years, setYears] = useState<number[]>([2024, 2025, 2026]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { cards, loading, error } = useSelector((state: RootState) => state.properties);
  const user = useSelector((state: RootState) => state.auth.user);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);

  useEffect(() => {
    if (id && cards.length > 0 && selectedCardIndex >= 0) {
      const propertyId = parseInt(id, 10);
      setSelectedCardIndex(propertyId);
      const cardwithid: any = cards.find((card) => {
        return card.id === propertyId
      })
      setSelectedCard(cardwithid);
    } else {
      setSelectedCardIndex(0);
      setSelectedCard(null);


    }
  }, [id, selectedCardIndex, cards]);


  useEffect(() => {
    const fetchData = async () => {
      const cardData: Card[] = [
        {
          id: 1,
          name: "Blue Bear Lake",
          address: "537 Blue Lake St, Garden City, Utah, United States, 84028",
          image: image1,
          details: {
            2024: {
              offSeason: "12/30",
              peakSeason: "1/14",
              peakHoliday: "0/1",
              offSeasonHoliday: "0/1",
            },
            2025: {
              offSeason: "8/30",
              peakSeason: "14/14",
              peakHoliday: "1/1",
              offSeasonHoliday: "0/1",
            },
            2026: {
              offSeason: "8/30",
              peakSeason: "3/14",
              peakHoliday: "1/1",
              offSeasonHoliday: "1/1",
            },
          },
        },
        {
          id: 2,
          name: "The Crown Jewel",
          address: "5409 South Aquamarine Lane, St. George, Utah, United States, 84790",
          image: image2,
          details: {
            2024: {
              offSeason: "10/30",
              peakSeason: "11/14",
              peakHoliday: "0/1",
              offSeasonHoliday: "0/1",
            },
            2025: {
              offSeason: "7/30",
              peakSeason: "8/14",
              peakHoliday: "1/1",
              offSeasonHoliday: "0/1",
            },
            2026: {
              offSeason: "23/30",
              peakSeason: "2/14",
              peakHoliday: "0/1",
              offSeasonHoliday: "1/1",
            },
          },
        },
        {
          id: 3,
          name: "Bear Lake Bluffs",
          address: "732 Spruce Drive, Garden City, Utah, United States, 84028",
          image: image3,
          details: {
            2024: {
              offSeason: "25/30",
              peakSeason: "1/14",
              peakHoliday: "1/1",
              offSeasonHoliday: "0/1",
            },
            2025: {
              offSeason: "22/30",
              peakSeason: "13/14",
              peakHoliday: "0/1",
              offSeasonHoliday: "0/1",
            },
            2026: {
              offSeason: "25/30",
              peakSeason: "12/14",
              peakHoliday: "1/1",
              offSeasonHoliday: "0/1",
            },
          },
        },
        {
          id: 4,
          name: "Lake Escape",
          address: "432 Crown Blue St, Garden City, UT 84078",
          image: image4,
          details: {
            2024: {
              offSeason: "11/30",
              peakSeason: "13/14",
              peakHoliday: "1/1",
              offSeasonHoliday: "0/1",
            },
            2025: {
              offSeason: "21/30",
              peakSeason: "3/14",
              peakHoliday: "0/1",
              offSeasonHoliday: "1/1",
            },
            2026: {
              offSeason: "23/30",
              peakSeason: "3/14",
              peakHoliday: "1/1",
              offSeasonHoliday: "0/1",
            },
          },
        },
      ];
      // You might want to dispatch these to Redux or set them to local state
      // setCards(cardData); 
    };

    fetchData();
  }, []);

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <Box className='AvailableHover'>
      <MenuItem disableRipple sx={{ padding: 0 }} className="AvailableHover">
        <div className="monsterrat my-4 propertyDetails">
          {selectedCard && (
            <div className="propert-card d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center pb-3">
                <h4 className="BlueHead2">Your 1/4 share</h4>
                <div className="ProfileImageContainer">
                  <img src={userImage} alt="Profile" className="ProfileImage" loading="lazy" />
                </div>
              </div>

              <div className="d-flex justify-content-between MyAvailProp">
                <p className="AvailableText">My Available Nights</p>
                <div className="d-flex justify-content-around align-items-center gap-3">
                  {years.map((year) => (
                    <button
                      key={year}
                      className={`card-btn2 ${selectedYear === year ? "active" : ""}`}
                      onClick={() => handleYearClick(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="box1 d-flex justify-content-around propertyDetailsYear">
                <div className="d-flex flex-column">
                  <li className="liststyle">
                    {selectedCard.details[selectedYear]?.offSeason || "N/A"}
                  </li>
                  <li className="Box-list1">Off-Season Nights</li>
                </div>
                <div className="d-flex flex-column night-count">
                  <li className="liststyle">
                    {selectedCard.details[selectedYear]?.peakSeason || "N/A"}
                  </li>
                  <li className="Box-list1">Peak-Season Nights</li>
                </div>
                <div className="d-flex flex-column night-count">
                  <li className="liststyle">
                    {selectedCard.details[selectedYear]?.peakHoliday || "N/A"}
                  </li>
                  <li className="Box-list1">Peak-Season Holiday</li>
                </div>
                <div className="d-flex flex-column night-count">
                  <li className="liststyle">
                    {selectedCard.details[selectedYear]?.offSeasonHoliday || "N/A"}
                  </li>
                  <li className="Box-list1">Off-Season Holiday</li>
                </div>

                <div className="d-flex flex-column night-count">
                  <li className="liststyle">
                    {selectedCard.details[selectedYear]?.lastMinute || "N/A"}
                  </li>
                  <li className="Box-list1">Last Minute Booking</li>
                </div>
              </div>
            </div>
          )}
        </div>
      </MenuItem>
    </Box>
  );
}