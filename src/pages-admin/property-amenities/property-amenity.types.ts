export interface Amenity {
    id: number;
    amenityName: string;
    amenityGroup: {
        id: number;
        name: string;
    };
}


export interface AmenityGroup {
    id: number;
    name: string;
}

export interface NewAmenityFormProps {
    onClose: () => void;
    onAmenityAdded: () => void;
}

