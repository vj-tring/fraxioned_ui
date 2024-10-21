import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyWithDetailsResponse, UserProperty } from '@/store/model/user-properties';
import { fetchUserProperties, fetchUserPropertiesWithDetailsByUser, createUserProperty, updateUserProperty, deleteUserProperty } from '../action/user-properties';

interface UserPropertyState {
  userProperties: UserProperty[];
  userPropertiesWithDetails: PropertyWithDetailsResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: UserPropertyState = {
  userProperties: [],
  userPropertiesWithDetails: [],
  loading: false,
  error: null,
};


const userPropertiesSlice = createSlice({
  name: 'userProperties',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProperties.fulfilled, (state, action: PayloadAction<UserProperty[]>) => {
        state.loading = false;
        state.userProperties = action.payload;
      })
      .addCase(fetchUserProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserPropertiesWithDetailsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPropertiesWithDetailsByUser.fulfilled, (state, action: PayloadAction<PropertyWithDetailsResponse[]>) => {
        state.loading = false;
        state.userPropertiesWithDetails = action.payload;
      })
      .addCase(fetchUserPropertiesWithDetailsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createUserProperty.fulfilled, (state, action: PayloadAction<UserProperty>) => {
        state.userProperties.push(action.payload);
      })
      .addCase(updateUserProperty.fulfilled, (state, action: PayloadAction<UserProperty>) => {
        const index = state.userProperties.findIndex((property) => property.id === action.payload.id);
        if (index !== -1) {
          state.userProperties[index] = action.payload;
        }
      })
      .addCase(deleteUserProperty.fulfilled, (state, action: PayloadAction<{ propertyId: number, id: number }>) => {
        state.userPropertiesWithDetails = state.userPropertiesWithDetails.filter(
          (property) => property.propertyId !== action.payload.propertyId
        );
        state.userProperties = state.userProperties.filter(
          (property) => property.id !== action.payload.id
        );
      });
  },
});

export default userPropertiesSlice.reducer;