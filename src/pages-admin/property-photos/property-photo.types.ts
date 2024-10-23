export interface PropertyImage {
  id: number;
  description: string;
  url: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  propertySpace: {
    id: number;
    instanceNumber: number;
    space: {
      id: number;
      name: string;
    };
    property: {
      id: number;
      propertyName: string;
    };
  };
  createdBy: {
    id: number;
  };
  updatedBy: {
    id: number;
  };
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    propertySpaceImages: PropertyImage[];
  };
}




export interface SpaceGroup {
  name: string;
  instances: {
    instanceNumber: number;
    images: PropertyImage[];
  }[];
}

export interface ImagesBySpace {
  [key: string]: SpaceGroup;
}