export interface PropertyCode {
    id: number;
    propertyCode: string;
    property: {
        id: number;
        propertyName: string;
    };
    propertyCodeCategory: {
        id: number;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: number;
    };
    updatedBy: null | {
        id: number;
    };
}

export interface CreatePropertyCodePayload {
    property: { id: number };
    propertyCodeCategory: { id: number };
    createdBy: { id: number };
    propertyCode: string;
}

export interface EditPropertyCodePayload {
    id: number;
    property: { id: number };
    propertyCodeCategory: { id: number };
    updatedBy: { id: number };
    propertyCode: string;
}

export interface PropertyCodesState {
    propertyCodes: PropertyCode[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}