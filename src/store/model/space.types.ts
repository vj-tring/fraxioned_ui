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
export interface CreatePropertySpaceBedDto {
  propertySpace: { id: number };
  spaceBedType: { id: number };
  count: number;
  createdBy: { id: number };
}

export interface UpdatePropertySpaceBedDto {
  propertySpace?: { id: number };
  spaceBedType?: { id: number };
  count?: number;
  updatedBy: { id: number };
}

export interface UpdatePropertySpaceBathroomDto {
  spaceBathroomType?: { id: number };
  propertySpace?: { id: number };
  count: number;
  updatedBy: { id: number };
}

export interface CreateOrDeletePropertySpaceBedsDto {
  propertySpace: { id: number };
  spaceBedTypes: SpaceBedTypeCount[];
  updatedBy: { id: number | undefined };
}

export interface SpaceBedTypeCount {
  spaceBedType: { id: number };
  count: number;
}

export interface CreatePropertySpaceBathroomDto {
  spaceBathroomType: { id: number };
  propertySpace: { id: number };
  count: number;
  createdBy: { id: number };
}

export interface CreateOrDeletePropertySpaceBathroomsDto {
  propertySpace: { id: number };
  spaceBathroomTypes: SpaceBathroomTypesCount[];
  updatedBy: { id: number | undefined };
}

export interface SpaceBathroomTypesCount {
  spaceBathroomType: { id: number };
  count: number;
}

export interface CreateSpaceBedTypeDto {
  name: string;
  description?: string;
  createdBy: { id: number };
}

export interface UpdateSpaceBedTypeDto {
  name?: string;
  description?: string;
  updatedBy: { id: number };
}

export interface CreateSpaceBathroomTypesDto {
  name: string;
  description?: string;
  createdBy: { id: number };
}

export interface UpdateSpaceBathroomTypesDto {
  name?: string;
  description?: string;
  updatedBy: { id: number };
}
