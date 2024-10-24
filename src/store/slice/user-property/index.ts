import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPropertiesState, UserPropertyDetails } from '@/store/model/user-property.types';
import { fetchUserPropertyDetails } from './action';

const initialState: UserPropertiesState = {
    propertyDetails: null,
    loading: false,
    error: null,
};

const userPropertiesSlice = createSlice({
    name: 'userProperties',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserPropertyDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPropertyDetails.fulfilled, (state, action: PayloadAction<UserPropertyDetails>) => {
                state.loading = false;
                state.propertyDetails = action.payload;
            })
            .addCase(fetchUserPropertyDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'An error occurred';
            });
    },
});

export default userPropertiesSlice.reducer;