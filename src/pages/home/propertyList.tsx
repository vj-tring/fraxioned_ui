import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import Card from "../../components/cards";
import { useSelector, useDispatch } from "react-redux";
import image1 from "../../assests/bear-lake-bluffs.jpg";
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

// Image interface
export interface Image {
  id: number;
  imageUrl: string;
  property: Property;
}

interface RootState {
  properties: {
    cards: Property[];
    loading: boolean;
    error: string | null;
  };
}

const PropertyList: React.FC<{ paddingLeft?: boolean }> = ({
  paddingLeft = false,
}) => {
  // const userId = useSelector((state: any) => state.auth.user?.id);
  const additionalPropertiesLength = 4;
  const { cards: properties } = useSelector(
    (state: RootState) => state.properties
  );
  const dispatch = useDispatch();
  const [images, setImages] = useState<Image[]>([]);
  const [additionalProperties, setAdditionalProperties] = useState<Property[]>(
    []
  );
  const carouselRef = useRef<HTMLDivElement>(null);
  const showCarousel = properties.length > 4;
  const showPlusIcon = true;

  const fetchAdditionalProperties = async () => {
    try {
      const response = await getProperties();

      if (!Array.isArray(response.data)) {
        throw new Error("Unexpected response format");
      }

      const allProperties = response.data as Property[];
      const numberOfUserProperties = properties.length;

      const numberOfPropertiesToShow = 5 - numberOfUserProperties;

      setAdditionalProperties(allProperties.slice(0, numberOfPropertiesToShow));
    } catch (error) {
      console.error("Error fetching properties:", error.message || error);
    }
  };

  useEffect(() => {
    dispatch(resetLimits());
    dispatch(clearDates());

    // fetchImages();
    fetchAdditionalProperties();
  }, [dispatch]);

  const scroll = (scrollOffset: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  // const Shadow =
  //   properties.length >= 4 ? "rgba(0, 0, 0, 0.1) 1px 1px 2px 1px" : "none";

  const formatCardName = (name: string | undefined) => {
    if (name) {
      return name.replace(/\s+\(.*\)/, "");
    } else {
      return "";
    }
  };

  return (
    <div className={` Container1 ${properties.length > 3 ? "" : "flex"}`}>
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
            // style={{ boxShadow: Shadow }}
            className={`Cardcontainer ${showCarousel ? "carousel" : ""}`}
            ref={carouselRef}
          >
            {properties.map((property) => {
              return (
                <Card
                  key={property.id}
                  imageUrl={property.coverImageUrl || PorpImg}
                  title={formatCardName(property.propertyName || "No Title")}
                  text={property.address || "Address not available"}
                  share={
                    property.propertyShare
                      ? `You Own ${property?.share}/${property.propertyShare}th share`
                      : "Share information not available"
                  }
                  id={property.id}
                />
              );
            })}

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

        {/* Render additional properties based on user properties count */}
      </div>

      <div className="NewsLetter">
        <NewsLetter />
      </div>

      {/* <a href="https://www.fraxioned.com/" target="_blank">
        <div className="AddProps ">
          {properties.length <= 4 &&
            additionalProperties
              .slice(0, additionalPropertiesLength - properties.length)
              .map((property) => {
                const propertyImage = images.find(
                  (img) => img.property.id === property.id
                );
                return (
                  <Card
                    key={property.id}
                    imageUrl={propertyImage?.imageUrl || image1}
                    title={formatCardName(property.propertyName || "No Title")}
                    text={property.address || "Address not available"}
                    // share={
                    //   property.propertyShare
                    //     ? `You Own ${property.share}/${property.propertyShare}th share`
                    //     : "Share information not available"
                    // }
                    // id={property.id}
                    tag="Hot Listing" // Pass the tag here
                  />
                );
              })}
        </div>
      </a> */}
    </div>
  );
};

export default PropertyList;
