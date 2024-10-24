import React, { useEffect, useRef } from "react";
import "./home.css";
import Card from "../../components/cards";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import PorpImg from "../../assests/lake-escape.jpg";
import { resetLimits } from "@/store/slice/auth/propertyGuestSlice";
import { clearDates } from "@/store/slice/datepicker";
import { User } from "@/store/model";
import {
  fetchPropertySpaceImagesByPropertyId,
  getProperties,
} from "@/store/services"; // Ensure getProperties is imported
import { fetchProperties } from "@/store/slice/auth/property-slice";
import NewsLetter from "./NewsLetter";
import { useAppSelector, useDispatch } from "@/store";
import { fetchUserPropertiesWithDetailsByUser } from "@/store/action/user-properties";
import { PropertyWithDetailsResponse } from "@/store/model/user-properties";
interface Property {
  id: number;
  name?: string;
  address?: string;
  propertyShare?: string;
  houseDescription?: string;
  state?: string;
  city?: string;
  country?: string;
  latitude?: string;
  longitude?: string;
  coverImageUrl?: string;
}

export interface Image {
  id: number;
  imageUrl: string;
  property: Property;
}

const PropertyList: React.FC<{ paddingLeft?: boolean }> = ({
  paddingLeft = false,
}) => {
  const userId = useSelector((state: any) => state.auth.user?.id);

  const { userPropertiesWithDetails } = useAppSelector(
    (state) => state.userProperties
  );

  const dispatch = useDispatch();

  const carouselRef = useRef<HTMLDivElement>(null);
  const showCarousel = userPropertiesWithDetails.length > 4;
  const showPlusIcon = true;

  useEffect(() => {
    dispatch(resetLimits());
    dispatch(clearDates());
    dispatch(fetchProperties(userId));
    dispatch(fetchUserPropertiesWithDetailsByUser(userId));
  }, [dispatch]);

  const scroll = (scrollOffset: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  const formatCardName = (name: string | undefined) => {
    if (name) {
      return name.replace(/\s+\(.*\)/, "");
    } else {
      return "";
    }
  };

  return (
    <div
      className={` Container1 ${
        userPropertiesWithDetails.length > 3 ? "" : "flex"
      }`}
    >
      <div>
        <div
          className="d-flex flex-row Container4"
          style={{
            marginLeft: paddingLeft ? "-45px" : "1%",
          }}
        >
          {showCarousel && (
            <div className="carousel-controls">
              <button
                className="carousel-control prev"
                onClick={() => scroll(-250)}
              >
                &#10094;
              </button>
            </div>
          )}
          <div
            className={`Cardcontainer ${showCarousel ? "carousel" : ""}`}
            ref={carouselRef}
          >
            {userPropertiesWithDetails.map(
              (property: PropertyWithDetailsResponse) => {
                return (
                  <Card
                    key={property.propertyId}
                    imageUrl={property.coverImageUrl || PorpImg}
                    title={formatCardName(property.propertyName || "No Title")}
                    text={property.address || "Address not available"}
                    share={
                      property.propertyShare
                        ? `You Own ${property.userProperties[0].noOfShare}/${property.propertyShare}th share`
                        : "Share information not available"
                    }
                    id={property.propertyId}
                  />
                );
              }
            )}

            {showPlusIcon && (
              <div className="FadeProp ">
                <div className="image-container">
                  <a href="https://www.fraxioned.com/" target="_blank">
                    <img
                      src={PorpImg}
                      className="card-img-top blur-effect"
                      alt=""
                      loading="lazy"
                    />
                    <FaPlus className="plus-icon" />
                  </a>
                </div>
                <div className="card-body card-body-plus">
                  <h4 className="card-title">Adventure Awaits...</h4>
                  <span className="card-text">
                    Discover your next Fraxioned home at fraxioned.com
                  </span>
                </div>
              </div>
            )}
          </div>
          {showCarousel && (
            <div className="carousel-controls">
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

      <div className="NewsLetter">
        <NewsLetter />
      </div>
    </div>
  );
};

export default PropertyList;
