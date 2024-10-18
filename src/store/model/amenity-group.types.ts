export interface AmenityGroup {
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

export interface AmenityGroupState {
    loading: boolean;
    error: string | null;
    success: boolean;
    data: AmenityGroup[] | null;
    addLoading: boolean;
    addError: string | null;
    addSuccess: boolean;
}