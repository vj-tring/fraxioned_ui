export interface PropertyCodes {
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

export interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}