export interface PropertyImageProps {
    onPropertySelect: (propertyId: number | string) => void;
    selectedPropertyId: number | string;
}

export interface Property {
    id: number;
    propertyName: string;
}