import React, { useEffect, useRef } from "react";
import "./home.css";
// import BookingSearchBar from "../../components/booking-search-bar";
import Card from "../../components/cards";
import { useSelector } from "react-redux";
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

const PropertyList: React.FC = () => {
  const {
    cards: properties,
    // loading,
    // error,
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
    <div className="Container1">
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
            {displayProperties.map((property,) => (
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
  );
};

export default PropertyList;
