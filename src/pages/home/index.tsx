import React from 'react';
import './home.css';
import BookingSearchBar from '../../components/booking-search-bar';
import Card from '../../components/cards';
import { useSelector } from 'react-redux';
import icon1 from '../../assests/Homeicons/1.png';
import icon2 from '../../assests/Homeicons/2.png';
import icon3 from '../../assests/Homeicons/3.png';
import icon4 from '../../assests/Homeicons/4.png';
import icon5 from '../../assests/Homeicons/5.png';
import icon6 from '../../assests/Homeicons/6.png';
import icon7 from '../../assests/Homeicons/7.png';

import image1 from '../../assests/bear-lake-bluffs.jpg';
import { mockProperties } from './mockData'; // Import the mock data

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


 

  const { cards: properties, loading, error } = useSelector((state: RootState) => state.properties);


const displayProperties = properties.length ? properties : mockProperties;




  return (
    <div className="home-content">
      <div className="HomeImg"></div>

      <BookingSearchBar />

      <hr className='mb-1'/>

      <div className="icons ">
        <div className="icon-container">
           <img className='HomeIcons mb-1 mt-2' src={icon1}></img>
          <p  className='IconsText'>My Bookings </p>
        </div>


        <div className="icon-container">
        <img className='HomeIcons mb-1 mt-2' src={icon2}></img>
          <p  className='IconsText'>Payments</p>
        </div>
        
        <div className="icon-container">
        <img className='HomeIcons mb-1 mt-2' src={icon3}></img>
          <p  className='IconsText'>Documents</p>
        </div>

        

        <div className="icon-container">
        <img className='HomeIcons mb-1 mt-2' src={icon4}></img>
          <p  className='IconsText'>Tickets</p>
        </div>


        <div className="icon-container">
        <img className='HomeIcons mb-1 mt-2' src={icon5}></img>
          <p  className='IconsText'>GuideBooks</p>
        </div>
        
      

        <div className="icon-container">
        <img className='HomeIcons mb-1 mt-2' src={icon6}></img>

          <p  className='IconsText'>FAQs</p>
        </div>
       

        <div className="icon-container">
          <img className='HomeIcons mb-1 mt-2' src={icon7}></img>
          <p  className='IconsText'>Contact us </p>
        </div>
      </div>

      <hr className='mt-3'/>

    
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div className="Cardcontainer">
        {displayProperties.map((property, index) => (
          <Card
            key={property.id}
            imageUrl={property.image || image1}
            title={property.name || 'No Title'}
            text={property.address || 'Address not available'}
            share={property.share ? `You Own ${property.share}/${property.propertyShare}th share` : 'Share information not available'}
            id={property.id}
            showPlusIcon={index === displayProperties.length - 1}  // Show plus icon only for the last card
          />
        ))}
      </div>
    </div>
  )
}

export default Home