export interface Property {
    id: number;
    propertyName: string;
    ownerRezPropId: number;
    address: string;
    city: string;
    state: string;
  }
  
  export interface PropertyDropdownProps {
    onPropertySelect: (propertyId: number | null) => void;
  }