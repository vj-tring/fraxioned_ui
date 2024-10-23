import React, { useEffect } from "react";
import "./home.css";
import BookingSearchBar from "../../components/booking-search-bar";
// import Card from "../../components/cards";
import { useSelector } from "react-redux";
// import image1 from "../../assests/bear-lake-bluffs.jpg";
// import { FaPlus } from "react-icons/fa";
// import { mockProperties } from "./mockData";
// import PorpImg from "../../assests/crown-jewel.jpg";
import { resetLimits } from "@/store/slice/auth/propertyGuestSlice";
import { useDispatch } from "react-redux";
import { clearDates } from "@/store/slice/datepicker";
import PropertyList from "./propertyList";
import BackgroundBeamsDemo from "./backgroundHome";
// import TrackingMyNigts from "../booking/trackingMyNights";
// import { fetchProperties } from "@/store/slice/auth/property-slice";
import dashboardAcc from "./dashboardAcc";
import DashboardAcc from "./dashboardAcc";
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
    // cards: properties,
    loading,
    error,
  } = useSelector((state: RootState) => state.properties);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetLimits());
    dispatch(clearDates());
  }, [dispatch]);

  return (
    <div className="home-content">
      <div className="HomeImg"></div>

      <BookingSearchBar />

      {/* {loading && <p>Loading...</p>} */}
      {/* {error &&  <p>{error}</p>} */}

      <div className="Container1">
        <PropertyList />
      </div>
  
    </div>
  );
};

export default Home;
