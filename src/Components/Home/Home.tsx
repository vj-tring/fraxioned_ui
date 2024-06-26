// src/Components/Home/Home.tsx

import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import './Home.css';
import HomeCard from '../../Components/Home/HomeCard';
import OffSeasonCard from '../../Components/Home/OffSeasonCard';
import PeakSeasonCard from '../../Components/Home/PeakSeasonCard';
import { fetchHomeData, fetchOffSeasonData, fetchPeakSeasonData } from './HomeDataFetchers';
import {  CombinedData } from './types';

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
