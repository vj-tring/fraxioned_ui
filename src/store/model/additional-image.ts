export interface PropertyImage {
    id?: number;
    description: string;
    displayOrder: number;
    property: {
        id: number;
    };
    createdBy: {
        id: number;
    };
}

export interface PropertyImagesState {
    images: PropertyImage[];
    loading: boolean;
    error: string | null;
    success: boolean;
    additionalImages: PropertyImage[];
    fetchLoading: boolean;
    fetchError: string | null;
}
