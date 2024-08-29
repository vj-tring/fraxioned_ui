import React from "react";
import "./home.css";
import icon1 from "../../assests/Homeicons/1.png";
import icon2 from "../../assests/Homeicons/2.png";
import icon3 from "../../assests/Homeicons/3.png";
import icon4 from "../../assests/Homeicons/4.png";
import icon5 from "../../assests/Homeicons/5.png";
import icon6 from "../../assests/Homeicons/6.png";
import icon7 from "../../assests/Homeicons/7.png";



const Icons: React.FC = () => {

 
  return (
   

      <div className="icons">
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
      </div>

    
  );
};

export default Icons;