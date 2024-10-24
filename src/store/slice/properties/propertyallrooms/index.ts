import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/reducers';
import { initialState, PropertySpaceDetails } from '@/store/model/property-all-rooms.types';
import { fetchPropertyAllRooms } from './action';


// Slice Definition
const propertyAllRoomsSpaceSlice = createSlice({
    name: 'propertySpace',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPropertyAllRooms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchPropertyAllRooms.fulfilled,
                (state, action: PayloadAction<PropertySpaceDetails>) => {
                    state.data = action.payload;
                    state.loading = false;
                }
            )
            .addCase(fetchPropertyAllRooms.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// Selector to Access Property Space Data
export const selectPropertySpace = (state: RootState) => state.propertySpace.data;

// Export Reducer
export default propertyAllRoomsSpaceSlice.reducer;
