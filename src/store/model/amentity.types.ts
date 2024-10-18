export interface Amenity {
  id?: number;
  amenityName: string;
  amenityDescription: string;
  s3_url?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: {
    id: number;
  };
  updatedBy: {
    id: number;
  };
  amenityGroup: {
    id: number;
    name?: string;
  };
  imageFile?: File | null;
}

export interface AmenitiesState {
  amenities: Amenity[];
  loading: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  success: boolean;
  deleteLoading: boolean;
  deleteSuccess: boolean;
  deleteError: string | null;
}
