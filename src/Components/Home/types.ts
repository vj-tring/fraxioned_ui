
// Update HomeData interface to reflect new structure
export interface HomeData {
    id: number;
    image: string;
    title: string;
    address: string; // Updated to a single string for address
    share: string; // Added for share information
  }
  
  // Define OffSeasonData and PeakSeasonData interfaces as needed
  export interface OffSeasonData {
    ownerId: number;
    totalNights: number;
    nightsUsed: number;
    nightsBooked: number;
    holidays: {
      total: number;
      used: number;
      booked: number;
      remaining: number;
    };
  }
  
  export interface PeakSeasonData {
    ownerId: number;
    totalNights: number;
    nightsStaying: number;
    nightsRenting: number;
  }
  
  // Define CombinedData interface if needed
  export interface CombinedData {
    id: number;
    homeData: HomeData;
    offSeasonData?: OffSeasonData;
    peakSeasonData?: PeakSeasonData;
  }
  

  