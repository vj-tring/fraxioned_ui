import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/api/axiosSetup';

interface Role {
    id: number;
    roleName: string;
    roleDescription: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string | null;
    updatedBy: string | null;
}

interface RolesState {
    roles: Role[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: RolesState = {
    roles: [],
    status: 'idle',
    error: null
};

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
    const response = await axiosInstance.get('/roles');
    return response.data.roles;
});

const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.roles = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch roles';
            });
    },
});

export default rolesSlice.reducer;
