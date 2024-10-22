// Define Types for the Response Data
interface Amenity {
    propertySpaceAmenityId: number;
    amenityId: number;
    amenityName: string;
    amenityDescription: string | null;
}

interface AmenityGroup {
    id: number;
    name: string;
    amenities: Amenity[];
}

export interface Bed {
    propertySpaceBedId: number;
    bedType: string;
    count: number;
    s3_image_url: string | null;
    spaceBedTypeId: number;
}

export interface Bathroom {
    propertySpaceBathroomId: number;
    bathroomType: string;
    count: number;
    s3_image_url: string | null;
    countValue: string | number;
    spaceBathroomTypeId: number;
}

interface SpaceImage {
    id: number;
    description: string;
    url: string;
    displayOrder: number;
}

export interface PropertySpace {
    id: number;
    propertySpaceName: string;
    propertySpaceInstanceNumber: number;
    spaceId: number;
    spaceName: string;
    propertySpaceImages: SpaceImage[];
    propertySpaceBeds: Bed[];
    propertySpaceBathrooms: Bathroom[];
    amenityGroups: AmenityGroup[];
}

interface PropertyAdditionalImage {
    id: number;
    description: string;
    url: string;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
    property: {
        id: number;
        propertyName: string;
    };
    createdBy: {
        id: number;
    };
    updatedBy: {
        id: number;
    };
}

interface Totals {
    total_number_of_bedrooms: number;
    total_number_of_bathrooms: number;
    total_number_of_beds: number;
}

export interface PropertySpaceDetails {
    propertySpace: PropertySpace[];
    propertyAdditionalImages: PropertyAdditionalImage[];
    totals: Totals;
}

// Slice State
export interface PropertySpaceState {
    data: PropertySpaceDetails | null;
    loading: boolean;
    error: string | null;
}

// Initial State
export const initialState: PropertySpaceState = {
    data: null,
    loading: false,
    error: null,
};
