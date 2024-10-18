import { createSlice } from '@reduxjs/toolkit';
import { fetchRoles } from './actions'
import { RolesState } from '@/store/model';

const initialState: RolesState = {
    roles: [],
    status: 'idle',
    error: null
};

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
export * from './actions';
export default rolesSlice.reducer;
