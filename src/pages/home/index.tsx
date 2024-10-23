import React, { useEffect } from "react";
import "./home.css";
import BookingSearchBar from "../../components/booking-search-bar";
import { resetLimits } from "@/store/slice/auth/propertyGuestSlice";
import { useDispatch } from "react-redux";
import { clearDates } from "@/store/slice/datepicker";
import PropertyList from "./propertyList";

const Home: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetLimits());
    dispatch(clearDates());
  }, [dispatch]);

  return (
    <div className="home-content">
      <div className="HomeImg"></div>
      <BookingSearchBar />
      <div className="Container1">
        <PropertyList />
      </div>
    </div>
  );
};

export default Home;
