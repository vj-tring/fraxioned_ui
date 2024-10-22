export interface PropertyDocument {
    id: number;
    documentUrl: string;
    documentName: string;
    documentType: string;
    property: { id: number; propertyName: string; };
    createdAt: string;
    updatedAt: string;
}