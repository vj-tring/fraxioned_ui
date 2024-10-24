export interface PropertyCodeCategory {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: number;
    };
    updatedBy: null | {
        id: number;
    };
}

export interface CreatePropertyCodeCategoryPayload {
    name: string;
    createdBy: {
        id: number;
    };
}

export interface CreatePropertyCodeCategoryResponse {
    createdBy: {
        id: number;
    };
    name: string;
}

export interface PropertyCodeCategoriesState {
    propertyCodeCategories: PropertyCodeCategory[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}