export interface PropertyImage {
    id: number;
    url: string;
    description: string;
    propertySpace?: {
      id: number;
      instanceNumber: number;
      space: {
        id: number;
        name: string;
      };
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