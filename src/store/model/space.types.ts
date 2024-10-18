export interface Space {
  id: number; // Optional for create and update
  name: string;
  s3_url?: string; // Added for fetched spaces
  isBedTypeAllowed: boolean;
  isBathroomTypeAllowed: boolean;
  createdAt?: string; // Optional for create
  updatedAt?: string; // Optional for create
  createdBy?: {
    id: number;
  };
  updatedBy?: {
    id: number;
  } | null;
}
export interface Property {
  id: number;
  propertyName: string;
}

// Define the CreatedBy interface
export interface CreatedBy {
  id: number;
}

// Define the SpaceProperty interface
export interface SpaceProperty {
  id: number;
  instanceNumber: number;
  createdAt: string;
  updatedAt: string;
  property: Property;
  space: Space;
  createdBy: CreatedBy;
  updatedBy: CreatedBy | null;
}

// Response structure for fetching all space properties
export interface SpacePropertyResponse {
  success: boolean;
  message: string;
  data: SpaceProperty[]; // An array of SpaceProperty
  statusCode: number;
}

export interface SpaceState {
  spaces: Space[];
  loading: boolean;
  error: string | null;
}

// State interface for the slice
export interface SpacePropertyState {
  spaceProperties: SpaceProperty[];
  loading: boolean;
  error: string | null;
}


// Define Space Image Interface
export interface SpaceImage {
    id: number;
    description: string;
    url: string;
    displayOrder: number;
    createdAt: string;
    updatedAt: string;
    propertySpace: {
        id: number;
        space: { id: number; name: string };
        property: { id: number; propertyName: string };
    };
    createdBy: { id: number };
    updatedBy: { id: number } | null;
}

// State Interface
export interface SpaceImageState {
    images: SpaceImage[];
    loading: boolean;
    error: string | null;
}