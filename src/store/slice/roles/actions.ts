import { axiosInstance } from '../../axiosSetup';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
    const response = await axiosInstance.get('/roles');
    return response.data.roles;
});
