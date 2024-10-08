
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosSetup';

interface PropertyType {
    id: number | string;
    propertyName: string;
    color: string;
}

interface PropertiesState {
    properties: PropertyType[];
    loading: boolean;
    error: string | null;
}

const initialState: PropertiesState = {
    properties: [],
    loading: false,
    error: null
};

export const fetchProperties = createAsyncThunk(
    'properties/fetchProperties',
    async () => {
        const response = await axiosInstance.get('/v1/properties');
        const colors = [
            '#FF9999', '#9999FF', '#99FF99', '#FFB266', '#FF6666', 
            '#FF99FF', '#999999', '#66FFB2', '#FFA07A', '#20B2AA', 
            '#99FF99', '#FFB266'
        ];

        const fetchedProperties = response.data.map((property: any, index: number) => ({
            id: property.id,
            propertyName: property.propertyName,
            color: colors[index % colors.length]
        }));

        const allHolidaysProperty: PropertyType = {
            id: 'all',
            propertyName: 'All Holidays',
            color: '#4CAF50'
        };

        return [allHolidaysProperty, ...fetchedProperties];
    }
);

const propertiesSlice = createSlice({
    name: 'property',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = action.payload;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch properties';
            });
    }
});

export default propertiesSlice.reducer;