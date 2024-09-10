import React, { useEffect, useRef } from "react";
import "./home.css";
import BookingSearchBar from "../../components/booking-search-bar";
import Card from "../../components/cards";
import { useSelector } from "react-redux";
// import icon1 from "../../assests/Homeicons/1.png";
// import icon2 from "../../assests/Homeicons/2.png";
// import icon3 from "../../assests/Homeicons/3.png";
// import icon4 from "../../assests/Homeicons/4.png";
// import icon5 from "../../assests/Homeicons/5.png";
// import icon6 from "../../assests/Homeicons/6.png";
// import icon7 from "../../assests/Homeicons/7.png";
import image1 from "../../assests/bear-lake-bluffs.jpg";
import { FaPlus } from "react-icons/fa";
import { mockProperties } from "./mockData";
import PorpImg from "../../assests/crown-jewel.jpg";
import { resetLimits } from "@/store/slice/auth/propertyGuestSlice";
import { useDispatch } from "react-redux";
import { clearDates } from "@/store/slice/datePickerSlice";

interface Property {
  id: number;
  propertyName?: string;
  address?: string;
  propertyShare?: string;
}

interface RootState {
  properties: {
    cards: Property[];
    loading: boolean;
    error: string | null;
  };
}

const Home: React.FC = () => {
  const {
    cards: properties,
    loading,
    error,
  } = useSelector((state: RootState) => state.properties);

  const dispatch = useDispatch();

  const displayProperties = properties.length ? properties : mockProperties;
  const showCarousel = displayProperties.length > 4;
  const carouselRef = useRef<HTMLDivElement>(null);
  const showPlusIcon = true;
  const scroll = (scrollOffset: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    dispatch(resetLimits());
    dispatch(clearDates());
  }, [dispatch]);

  const Shadow =
    properties.length >= 4 ? "rgba(0, 0, 0, 0.1) 1px 1px 2px 1px" : "none";

  return (
    <div className="home-content">
      <div className="HomeImg">
        {/* <h1>Find your favourite </h1>
        <h1>place here! </h1>
        <h1 className="TitleDesc">
          The best price for over 2 million properties worldwide{" "}
        </h1> */}
      </div>

      <BookingSearchBar />

      {/* <hr className="mb-1" /> */}

      {/* <div className="icons">
        <div className="icon-container">
          <img className="HomeIcons mb-1 mt-2" src={icon1} alt="My Bookings" />
          <p className="IconsText">My Bookings</p>
        </div>

        <div className="icon-container">
          <img className="HomeIcons mb-1 mt-2" src={icon2} alt="Payments" />
          <p className="IconsText">Payments</p>
        </div>

        <div className="icon-container">
          <img className="HomeIcons mb-1 mt-2" src={icon3} alt="Documents" />
          <p className="IconsText">Documents</p>
        </div>

        <div className="icon-container">
          <img className="HomeIcons mb-1 mt-2" src={icon4} alt="Tickets" />
          <p className="IconsText">Tickets</p>
        </div>

        <div className="icon-container">
          <img className="HomeIcons mb-1 mt-2" src={icon5} alt="GuideBooks" />
          <p className="IconsText">GuideBooks</p>
        </div>

        <div className="icon-container">
          <img className="HomeIcons mb-1 mt-2" src={icon6} alt="FAQs" />
          <p className="IconsText">FAQs</p>
        </div>

        <div className="icon-container">
          <img className="HomeIcons mb-1 mt-2" src={icon7} alt="Contact us" />
          <p className="IconsText">Contact us</p>
        </div>
      </div> */}

      {/* <hr className="mt-3" /> */}

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="Container1">
        {/* <div className="holidayAcc">
          <div className="holitxt ">
            <p>Holiday accommodation recommendation for you</p>
          </div>

          <div className="Search pt-3">
            <SearchAppBar />
          </div>
        </div> */}
        <div>
          <div className="d-flex flex-row PropImg ">
            {showCarousel && (
              <div className="carousel-controls ">
                <button
                  className="carousel-control prev"
                  onClick={() => scroll(-250)}
                >
                  &#10094;
                </button>
              </div>
            )}
            <div
              style={{ boxShadow: Shadow }}
              className={`Cardcontainer  ${showCarousel ? "carousel" : ""}`}
              ref={carouselRef}
            >
              {displayProperties.map((property, index) => (
                <Card
                  key={property.id}
                  imageUrl={property.image || image1}
                  title={property.name || "No Title"}
                  text={property.address || "Address not available"}
                  share={
                    property.share
                      ? `You Own ${property.share}/${property.propertyShare}th share`
                      : "Share information not available"
                  }
                  id={property.id}
                />
              ))}
              {showPlusIcon && (
                <div className=" FadeProp">
                  <div className="image-container   ">
                    <a href="https://www.fraxioned.com/" target="_blank">
                      <img
                        src={PorpImg}
                        className="card-img-top blur-effect"
                        alt=""
                      />
                      <FaPlus className="plus-icon" />
                    </a>
                  </div>

                  <div className="card-body">
                    <h4 className="card-title">Adventure Awaits...</h4>
                    <span className="card-text">
                      Discover your next Fraxioned home at fraxioned.com
                    </span>
                  </div>
                </div>
              )}
            </div>
            {showCarousel && (
              <div className="carousel-controls ">
                <button
                  className="carousel-control next"
                  onClick={() => scroll(250)}
                >
                  &#10095;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
