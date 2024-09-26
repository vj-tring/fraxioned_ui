import React, { useEffect, useRef } from "react";
import "./home.css";
import BookingSearchBar from "../../components/booking-search-bar";
// import Card from "../../components/cards";
import { useSelector } from "react-redux";
// import image1 from "../../assests/bear-lake-bluffs.jpg";
// import { FaPlus } from "react-icons/fa";
import { mockProperties } from "./mockData";
// import PorpImg from "../../assests/crown-jewel.jpg";
import { resetLimits } from "@/store/slice/auth/propertyGuestSlice";
import { useDispatch } from "react-redux";
import { clearDates } from "@/store/slice/datePickerSlice";
import PropertyList from "./propertyList";
import TrackingMyNigts from "../booking/trackingMyNights";

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

 
  return (
    <div className="home-content">
      <div className="HomeImg"></div>

      <BookingSearchBar />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
       
      <div className="Container1">
        <PropertyList />
      </div>


    </div>
  );
};

export default Home;
