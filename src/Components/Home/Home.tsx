import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import './Home.css';
import HomeCard from '../../Components/Home/HomeCard';
import OffSeasonCard from '../../Components/Home/OffSeasonCard';
import PeakSeasonCard from '../../Components/Home/PeakSeasonCard';
import homeImage from '../../assets/building.jpg';
import { HomeData, OffSeasonData, PeakSeasonData, CombinedData } from './types';

const fetchHomeData = async (): Promise<HomeData[]> => {
  return [
    { id: 1, image: homeImage, title: 'BLUE BEAR LAKE', address: "537 Blue Lake St, Garden City, UT 84078", share: " 1/8 " },
    { id: 2, image: homeImage, title: 'ANOTHER HOME', address: "123 Main St, Anytown, USA", share: " 1/4 " },
    { id: 3, image: homeImage, title: 'third HOME', address: "123 Main St, Anytown, USA", share: " 1/4 " }
  ];
};

const fetchOffSeasonData = async (): Promise<OffSeasonData[]> => {
  return [
    { ownerId: 1, totalNights: 30, nightsUsed: 0, nightsBooked: 7, holidays: { total: 10, used: 0, booked: 0, remaining: 1 } },
    { ownerId: 2, totalNights: 20, nightsUsed: 20, nightsBooked: 5, holidays: { total: 22, used: 0, booked: 0, remaining: 2 } },
    { ownerId: 3, totalNights: 20, nightsUsed: 0, nightsBooked: 5, holidays: { total: 12, used: 0, booked: 0, remaining: 2 } }
  ];
};

const fetchPeakSeasonData = async (): Promise<PeakSeasonData[]> => {
  return [
    { ownerId: 1, totalNights: 14, nightsStaying: 5, nightsRenting: 9 },
    { ownerId: 2, totalNights: 10, nightsStaying: 3, nightsRenting: 7 },
    { ownerId: 3, totalNights: 10, nightsStaying: 3, nightsRenting: 7 }
  ];
};

const Home: React.FC = () => {
  const [combinedData, setCombinedData] = useState<CombinedData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeData, offSeasonData, peakSeasonData] = await Promise.all([
          fetchHomeData(),
          fetchOffSeasonData(),
          fetchPeakSeasonData()
        ]);

        const combinedData: CombinedData[] = homeData.map(home => {
          const offSeason = offSeasonData.find(item => item.ownerId === home.id);
          const peakSeason = peakSeasonData.find(item => item.ownerId === home.id);

          return {
            id: home.id,
            homeData: home,
            offSeasonData: offSeason,
            peakSeasonData: peakSeason
          };
        });

        setCombinedData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="home-content">
      <div className="welcome-section">
        <h1 className="welcome-owner">WELCOME OWNER!</h1>
        <h2 className="your-homes">YOUR HOMES</h2>
      </div>

      <div className="home-cards-container">
        {combinedData.map((dataItem) => (
          <Card key={dataItem.id} className="home-card">
            <HomeCard 
              image={dataItem.homeData.image}
              title={dataItem.homeData.title}
              address={dataItem.homeData.address}
              share={dataItem.homeData.share}
              buttonText="BOOK A STAY"
            />
            {dataItem.offSeasonData && (
              <OffSeasonCard 
                totalNights={dataItem.offSeasonData.totalNights}
                nightsUsed={dataItem.offSeasonData.nightsUsed}
                nightsBooked={dataItem.offSeasonData.nightsBooked}
                holidays={dataItem.offSeasonData.holidays}
              />
            )}
            {dataItem.peakSeasonData && (
              <PeakSeasonCard 
                totalNights={dataItem.peakSeasonData.totalNights}
                nightsStaying={dataItem.peakSeasonData.nightsStaying}
                nightsRenting={dataItem.peakSeasonData.nightsRenting}
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
