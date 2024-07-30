export interface HomeData {
  id: number
  image: string
  title: string
  address: string
  share: string 
}

export interface OffSeasonData {
  ownerId: number
  totalNights: number
  nightsUsed: number
  nightsBooked: number
  holidays: {
    total: number
    used: number
    booked: number
    remaining: number
  }
}

export interface PeakSeasonData {
  ownerId: number
  totalNights: number
  nightsStaying: number
  nightsRenting: number
}

export interface CombinedData {
  id: number
  homeData: HomeData
  offSeasonData?: OffSeasonData
  peakSeasonData?: PeakSeasonData
}
