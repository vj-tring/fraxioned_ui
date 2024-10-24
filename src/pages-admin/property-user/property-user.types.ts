export interface User {
    id: number;
    firstName: string;
    lastName: string;
}

export interface PropertyUser {
    userId: number;
    noOfShare: number;
    acquisitionDate: string;
}

// Note: This interface can be removed if you're using the UserPropertyDetails
// interface from the model/user-property.ts file
export interface PropertyDetails {
    propertyId: number;
    propertyName: string;
    propertyShare: number;
    owners: PropertyUser[];
}