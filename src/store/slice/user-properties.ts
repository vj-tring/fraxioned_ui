import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PropertyWithDetailsResponse, UserProperty } from '@/store/model/user-properties';
import { 
  fetchUserProperties, 
  fetchUserPropertiesWithDetailsByUser, 
  createUserProperty, 
  updateUserProperty, 
  deleteUserProperty 
} from '../action/user-properties';

interface UserPropertyState {
  userProperties: UserProperty[];
  userPropertiesWithDetails: PropertyWithDetailsResponse[];
  loading: boolean;
  error: string | null;
  isAddingProperty: boolean;
  isDeletingProperty: boolean;
}

const initialState: UserPropertyState = {
  userProperties: [],
  userPropertiesWithDetails: [],
  loading: false,
  error: null,
  isAddingProperty: false,
  isDeletingProperty: false,
};

const userPropertiesSlice = createSlice({
  name: 'userProperties',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user properties with details
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
      .addCase(createUserProperty.pending, (state) => {
        state.isAddingProperty = true;
        state.error = null;
      })
      .addCase(createUserProperty.fulfilled, (state, action: PayloadAction<UserProperty>) => {
        state.isAddingProperty = false;
      })
      .addCase(createUserProperty.rejected, (state, action) => {
        state.isAddingProperty = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUserProperty.pending, (state) => {
        state.isDeletingProperty = true;
        state.error = null;
      })
      .addCase(deleteUserProperty.fulfilled, (state, action: PayloadAction<{ propertyId: number, id: number }>) => {
        state.isDeletingProperty = false;
      })
      .addCase(deleteUserProperty.rejected, (state, action) => {
        state.isDeletingProperty = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userPropertiesSlice.actions;
export default userPropertiesSlice.reducer;
