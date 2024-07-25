
import homeImage from '../../assets/building.jpg';
import { HomeData, OffSeasonData, PeakSeasonData } from './types';

export const fetchHomeData = async (): Promise<HomeData[]> => {
  return [
    { id: 1, image: homeImage, title: 'BLUE BEAR LAKE', address: "537 Blue Lake St, Garden City, UT 84078", share: " 1/8 " },
    { id: 2, image: homeImage, title: 'ANOTHER HOME', address: "123 Main St, Anytown, USA", share: " 1/4 " },
    { id: 3, image: homeImage, title: 'third HOME', address: "123 Main St, Anytown, USA", share: " 1/4 " }
  ];
};

export const fetchOffSeasonData = async (): Promise<OffSeasonData[]> => {
  return [
    { ownerId: 1, totalNights: 30, nightsUsed: 0, nightsBooked: 7, holidays: { total: 10, used: 0, booked: 0, remaining: 1 } },
    { ownerId: 2, totalNights: 20, nightsUsed: 20, nightsBooked: 5, holidays: { total: 22, used: 0, booked: 0, remaining: 2 } },
    { ownerId: 3, totalNights: 20, nightsUsed: 0, nightsBooked: 5, holidays: { total: 12, used: 0, booked: 0, remaining: 2 } }
  ];
};

export const fetchPeakSeasonData = async (): Promise<PeakSeasonData[]> => {
  return [
    { ownerId: 1, totalNights: 14, nightsStaying: 5, nightsRenting: 9 },
    { ownerId: 2, totalNights: 10, nightsStaying: 3, nightsRenting: 7 },
    { ownerId: 3, totalNights: 10, nightsStaying: 3, nightsRenting: 7 }
  ];
};


