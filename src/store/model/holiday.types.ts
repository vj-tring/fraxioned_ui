export interface Property {
    id: number;
    propertyName: string;
}

export interface RootState {
    auth: {
        user: {
            id: number;
        } | null;
    };
    property: {
        properties: Property[];
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | null;
    };
    holiday: HolidayState;
}

export interface NewFormProps {
    onClose: () => void;
    onHolidayAdded: () => void;
  }

export interface PropertySeasonHoliday {
    id: number;
    property: Property;
}

export interface Holiday {
    id: number;
    name: string;
    year: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: number;
    };
    updatedBy: {
        id: number;
    };
    properties: { id: number }[];
    propertySeasonHolidays?: PropertySeasonHoliday[];
}

export interface FetchHolidayResponse {
    success: boolean;
    message: string;
    data: Holiday;
    statusCode: number;
}

export interface HolidayState {
    holidays: Holiday[];
    selectedHoliday: Holiday | null;
    loading: boolean;
    error: string | null;
}

