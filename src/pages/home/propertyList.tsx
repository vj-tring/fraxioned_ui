import React, { useEffect, useRef, useState } from "react";
import "./home.css";
import Card from "../../components/cards";
import { useSelector, useDispatch } from "react-redux";
import image1 from "../../assests/bear-lake-bluffs.jpg";
import { FaPlus } from "react-icons/fa";
import PorpImg from "../../assests/crown-jewel.jpg";
import { resetLimits } from "@/store/slice/auth/propertyGuestSlice";
import { clearDates } from "@/store/slice/datePickerSlice";
import { User } from "@/store/model";
import { propertyImageapi } from "@/api";

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
}

// Interface for space details
interface Space {
  id: number;
  name: string;
}

// Interface for space type details
interface SpaceType {
  id: number;
  name: string;
  space: Space;
}

export interface Image {
  createdAt: string;
  updatedAt: string;
  id: number;
  imageUrl: string;
  imageName: string;
  displayOrder: number;
  spaceType: SpaceType;
  property: Property;
  createdBy: User;
  updatedBy: User;
}

interface RootState {
  properties: {
    cards: Property[];
    loading: boolean;
    error: string | null;
  };
}
interface PropertyListProps {
  paddingLeft?: boolean;
}

const PropertyList: React.FC<PropertyListProps> = ({ paddingLeft = false }) => {
  const { cards: properties } = useSelector(
    (state: RootState) => state.properties
  );

  const dispatch = useDispatch();
  const [images, setImages] = useState<Image[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const showCarousel = properties.length > 4;
  const showPlusIcon = true;

  const fetchImages = async () => {
    try {
      const response = await propertyImageapi();
      const data = response.data.data as Image[];
      setImages(data.filter((img) => img.displayOrder === 1));
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    dispatch(resetLimits());
    dispatch(clearDates());
    fetchImages();
  }, [dispatch]);

  const scroll = (scrollOffset: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  const Shadow =
    properties.length >= 4 ? "rgba(0, 0, 0, 0.1) 1px 1px 2px 1px" : "none";

  const formatCardName = (name: string) => {
    return name.replace(/\s+\(.*\)/, "");
  };

  return (
    <div className="Container1">
      <div>
        <div
          className="d-flex flex-row Container1 "
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
            style={{ boxShadow: Shadow }}
            className={`Cardcontainer ${showCarousel ? "carousel" : ""}`}
            ref={carouselRef}
          >
            {properties.map((property) => {
              const propertyImage = images.find(
                (img) => img.property.id === property.id
              );
              return (
                <Card
                  key={property.id}
                  imageUrl={propertyImage?.imageUrl || image1}
                  title={formatCardName(property.name || "No Title")}
                  text={property.address || "Address not available"}
                  share={
                    property.propertyShare
                      ? `You Own ${property.share}/${property.propertyShare}th share`
                      : "Share information not available"
                  }
                  id={property.id}
                />
              );
            })}
            {showPlusIcon && (
              <div className="FadeProp">
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
                  <span className="card-text ">
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
    </div>
  );
};

export default PropertyList;
