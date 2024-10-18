export interface Holiday {
    id: number;
    name: string;
    year: number;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    updated_by: string | null;
    propertyId: number | null;
    propertySeasonHolidayId: number | null;
  }

  export interface EditFormProps {
    onClose: () => void;
    onHolidayUpdated: () => void;
    holidayData: {
      id: number;
      name: string;
      year: number;
      startDate: string;
      endDate: string;
    };
  }

  export interface NewFormProps {
    onClose: () => void;
    onHolidayAdded: () => void;
  }