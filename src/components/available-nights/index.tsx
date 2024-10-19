/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import "./available-night.css";
import userImage from "../../assets/images/profile.jpeg";
import { RootState } from "../../store/reducers";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Card } from "@/store/slice/auth/property-slice";
import { fetchAllImages, fetchImagesByPropertySpaceId } from "@/store/slice/spaceImagesSlice";
import { AppDispatch } from "@/store";

export default function AvailableNights() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { cards } = useSelector((state: RootState) => state.properties);
  // const { image: any } = useSelector(
  //   (state: RootState) => state.spaceImage.images
  // );

  // useEffect(() => {
  //   dispatch(fetchAllImages());
  // }, [dispatch]);

  // const years = Object.keys(selectedCard?.details as { [year: number]: propertyAvailableDaysDetails }).map(Number);
  // const user = useSelector((state: RootState) => state.auth.user);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);

  useEffect(() => {
    if (id && cards.length > 0 && selectedCardIndex >= 0) {
      const propertyId = parseInt(id, 10);
      setSelectedCardIndex(propertyId);
      const cardwithid: any = cards.find((card: { id: number }) => {
        return card.id === propertyId;
      });

      setSelectedCard(cardwithid);
      setYears(Object.keys(cardwithid.details).map(Number));
      // setYears(Object.keys(card)
    } else {
      setSelectedCardIndex(0);
      setSelectedCard(null);
    }
  }, [id, selectedCardIndex, cards]);

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };

  return (
    <Box className="AvailableHover">
      <MenuItem disableRipple sx={{ padding: 0 }} className="AvailableHover">
        <div className="monsterrat my-4 propertyDetails">
          {selectedCard && (
            <div className="propert-card d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center pb-3">
                <h4 className="BlueHead2">Your 1/4 share</h4>
                <div className="ProfileImageContainer">
                  <img
                    src={userImage}
                    alt="Profile"
                    className="ProfileImage"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between MyAvailProp">
                <p className="AvailableText">My Available Nights</p>
                <div className="d-flex justify-content-around align-items-center gap-3">
                  {years.map((year) => (
                    <button
                      key={year}
                      className={`card-btn2 ${
                        selectedYear === year ? "active" : ""
                      }`}
                      onClick={() => handleYearClick(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="box1 d-flex  justify-content-around propertyDetailsYear">
                <ul className="d-flex">
                  <div className="d-flex flex-column night-count">
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
                      {selectedCard.details[selectedYear]?.offSeasonHoliday ||
                        "N/A"}
                    </li>
                    <li className="Box-list1">Off-Season Holiday</li>
                  </div>

                  <div className="d-flex flex-column night-count">
                    <li className="liststyle">
                      {selectedCard.details[selectedYear]?.lastMinute || "N/A"}
                    </li>
                    <li className="Box-list1">Last Minute Booking</li>
                  </div>
                </ul>
              </div>
            </div>
          )}
        </div>
      </MenuItem>
    </Box>
  );
}
