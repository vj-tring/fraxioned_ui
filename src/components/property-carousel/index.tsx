import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import NavigatePreviousOutlinedIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../store/index";
import { RootState } from "../../store/reducers";
import {
  fetchProperties,
  selectProperty,
  selectcard,
  selectcardindex,
  // setSelectedCard,
  // setSelectedCardIndex
} from "../../store/slice/auth/property-slice";
import "./propertycarousel.css";

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
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [years] = useState<number[]>([2024, 2025, 2026]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const carouselRef = useRef<HTMLDivElement>(null);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch<AppDispatch>();

  const { cards, loading, error } = useSelector(
    (state: RootState) => state.properties
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const val = useSelector((state: RootState) => state.datePicker.startDate);

  useEffect(() => {
    if (user) {
      dispatch(fetchProperties(user.id));
    }
  }, [dispatch, user]);

  const property = useSelector((state: RootState) => state.properties);
  useEffect(() => {
    setSelectedCardIndex(property.selectedCardIndex);
  }, []);
  useEffect(() => {
    if (selectedCardIndex != null) {
      if (cards.length > 0) {
        setSelectedCard(cards[selectedCardIndex]);
        setSelectedCardIndex(selectedCardIndex);
        const card = cards[selectedCardIndex];
        dispatch(selectProperty(card.id));
        dispatch(selectcardindex(selectedCardIndex));
        dispatch(selectcard(cards[selectedCardIndex]));
      } else {
        setSelectedCard(null);
      }
    }
  }, [selectedCardIndex, cards]);

  useEffect(() => {
    if (carouselRef.current) {
      const selectedElement = carouselRef.current.children[
        selectedCardIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedCardIndex]);

  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
    const card = cards[index];
    dispatch(selectProperty(card.id));
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };

  const handlePrevious = () => {
    setSelectedCardIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setSelectedCardIndex((prevIndex) =>
      Math.min(prevIndex + 1, cards.length - 1)
    );
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [open]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const showCarousel = cards.length > 0;
  const showCarouselControls = cards.length > 1;
  const cardItemWidth =
    cards.length === 1 ? "380px" : cards.length === 2 ? "380px" : "550px";
  const buttonSize = {
    width:
      cards.length === 1 ? "3.7rem" : cards.length === 2 ? "3.7rem" : "5rem",

    height: cards.length === 1 ? "20px" : cards.length === 2 ? "20px" : "25px",
  };
  const imageClass = cards.length === 2 ? "single-card" : "multiple-cards";

  const BoxList =
    cards.length === 1 ? "7px" : cards.length === 2 ? "7px" : "10px";
  const BoxMargin =
    cards.length === 1 ? "0px" : cards.length === 2 ? "0px" : "8px";
  const cardItemHeight =
    cards.length === 1 ? "232px" : cards.length === 2 ? "232px" : "250px";
  const cardNameWeight =
    cards.length === 1 ? "600" : cards.length === 2 ? "600" : "600";

  const formatCardName = (name: string) => {
    return name.replace(/\s+\(.*\)/, "...");
  };

  return (
    <Box sx={{ width: 250, borderRadius: 32, border: "none" }}>
      <Button
        disableRipple
        aria-controls="basic-menu"
        aria-haspopup="true"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        className="PropertyBtn"
        sx={{
          borderRadius: 10,
          width: 264,
          height: 70,
          border: "none",
          cursor: "pointer",
          paddingRight: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="d-flex align-items-start flex-column card-item">
          <span className="DateHead1 monsterrat">My Home(s)</span>
          <p className="property1 monsterrat">
            {selectedCard ? selectedCard?.name : "Select Property"}
          </p>
        </div>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            position: "fixed",
            maxHeight: "60vh",
            overflowY: "auto",
          },
        }}
        sx={{ borderRadius: 32 }}
      >
        {cards.length === 0 ? (
          <MenuItem
            disableRipple
            sx={{ "&:hover": { backgroundColor: "white !important" } }}
          >
            <div
              className="CardItem py-2"
              style={{
                width: cardItemWidth,
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <div className="card-content">
                <h4>No Data Found</h4>
              </div>
            </div>
          </MenuItem>
        ) : (
          <MenuItem
            disableRipple
            sx={{ "&:hover": { backgroundColor: "white !important" } }}
          >
            <div
              className="CardItem  "
              style={{ width: cardItemWidth, height: cardItemHeight }}
            >
              {showCarousel && (
                <div className="card-container">
                  <div className="d-flex flex-row">
                    {showCarouselControls && (
                      <IconButton
                        onClick={handlePrevious}
                        disableRipple
                        sx={{ padding: 0 }}
                        disabled={selectedCardIndex === 0}
                      >
                        <NavigatePreviousOutlinedIcon />
                      </IconButton>
                    )}
                    <div
                      className="d-flex flex-row w-100"
                      style={{
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                        justifyContent: "space-evenly",
                      }}
                      ref={carouselRef}
                    >
                      {cards.map((card: Card, index: number) => (
                        <Button
                          key={card.id}
                          disableRipple
                          className={`additionalproperty ${
                            selectedCardIndex === index ? "active" : ""
                          }`}
                          // style={{ padding: additionalPadding }}
                          onClick={() => handleCardClick(index)}
                          sx={{
                            flex: "0 0 auto",
                            margin: "7px",
                            padding: "4px",
                          }}
                        >
                          <div className="d-flex flex-column align-items-center p-1.5">
                            <h4 className="property-name">
                              {formatCardName(card.name)}
                            </h4>
                          </div>
                        </Button>
                      ))}
                    </div>
                    {showCarouselControls && (
                      <IconButton
                        onClick={handleNext}
                        disableRipple
                        sx={{ padding: 0, fontSize: "2.0rem" }}
                        disabled={selectedCardIndex === cards.length - 1}
                      >
                        <NavigateNextOutlinedIcon />
                      </IconButton>
                    )}
                  </div>
                </div>
              )}
              {selectedCard && (
                <div className="card-content">
                  {cards.length > 1 && showCarousel && (
                    <div className="dots-container">
                      {cards.map((_, index: number) => (
                        <div
                          key={index}
                          className={`dot ${
                            index === selectedCardIndex ? "active" : ""
                          }`}
                          onClick={() => handleCardClick(index)}
                        ></div>
                      ))}
                    </div>
                  )}
                  <div className="card-name d-flex justify-content-between py-2 align-items-center gy-1">
                    <span className="CardFont">
                      <h4
                        className="BlueHead"
                        style={{ fontWeight: cardNameWeight }}
                      >
                        {selectedCard.name} [{selectedCard.share}/
                        {selectedCard.propertyShare} share]
                      </h4>
                      <p className="BlueFont">{selectedCard.address}</p>
                    </span>
                    <span className={`CardImage ${imageClass}`}>
                      <img
                        src={selectedCard.image}
                        alt={selectedCard.name}
                        className="property-image"
                      />
                    </span>
                  </div>
                  <div className="d-flex justify-content-between py-2 align-items-center pt-0">
                    <p className="Available">My Available Nights</p>
                    <div className="d-flex justify-content-center">
                      {years.map((year) => (
                        <Button
                          disableRipple
                          key={year}
                          onClick={() => handleYearClick(year)}
                          className={`card-btn1 ${
                            selectedYear === year ? "active" : ""
                          }`}
                          sx={{
                            margin: "2px",
                            padding: "4px",
                            paddingTop: "5px",
                            borderRadius: 16,
                            ...buttonSize,
                          }}
                        >
                          {year}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div
                    className="box d-flex justify-content-around py-1"
                    style={{ marginTop: BoxMargin }}
                  >
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.offSeason || "N/A"}
                      </li>
                      <li style={{ fontSize: BoxList }}>Off-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.peakSeason ||
                          "N/A"}
                      </li>
                      <li style={{ fontSize: BoxList }}>Peak-Season Nights</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.peakHoliday ||
                          "N/A"}
                      </li>
                      <li style={{ fontSize: BoxList }}>Peak-Season Holiday</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.offSeasonHoliday ||
                          "N/A"}
                      </li>
                      <li style={{ fontSize: BoxList }}>Off-Season Holiday</li>
                    </div>
                    <div className="d-flex flex-column night-count">
                      <li>
                        {selectedCard.details[selectedYear]?.lastMinute ||
                          "N/A"}
                      </li>
                      <li style={{ fontSize: BoxList }}>Last Minute Booking</li>
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
