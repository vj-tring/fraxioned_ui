import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/api/axiosSetup';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    imageURL: string | null;
    isActive: number;
    addressLine1: string | null;
    addressLine2: string | null;
    state: string | null;
    country: string | null;
    city: string | null;
    zipcode: string | null;
    lastLoginTime: string;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
    contactDetails: {
        id: number;
        primaryEmail: string;
        secondaryEmail: string | null;
        optionalEmailOne: string | null;
        optionalEmailTwo: string | null;
        primaryPhone: string;
        secondaryPhone: string | null;
        optionalPhoneOne: string | null;
        optionalPhoneTwo: string | null;
    };
    role: {
        id: number;
        roleName: string;
    };
}

interface UserDetailsState {
    users: User[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: UserDetailsState = {
    users: [],
    status: 'idle',
    error: null,
};

export const fetchUserDetails = createAsyncThunk(
    'userDetails/fetchUserDetails',
    async () => {
        const response = await axiosInstance.get('/v1/users');
        return response.data;
    }
);

const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload.users;
            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch user details';
            });
    },
});

export default userDetailsSlice.reducer;