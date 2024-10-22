import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "@/store/model";
import { fetchUserById, updateUserById } from "./action";

const initialState: UserState = {
    user: {
        id: 0,
        role: {
            id: 0,
            roleName: "",
        },
        firstName: "",
        lastName: "",
        imageURL: null,
        isActive: false,
        addressLine1: null,
        addressLine2: null,
        state: null,
        country: null,
        city: null,
        zipcode: null,
        lastLoginTime: "",
        contactDetails: {
            id: 0,
            primaryEmail: "",
            secondaryEmail: null,
            optionalEmailOne: null,
            optionalEmailTwo: null,
            primaryPhone: "",
            secondaryPhone: null,
            optionalPhoneOne: null,
            optionalPhoneTwo: null,
        },
    },
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: "UserDetails",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                const {
                    password,
                    resetToken,
                    resetTokenExpires,
                    updatedAt,
                    createdAt,
                    updatedBy,
                    createdBy,
                    ...userData
                } = action.payload;
                state.user = userData;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch user details";
            })
            .addCase(updateUserById.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUserById.fulfilled, (state, action) => {
                const {
                    password,
                    resetToken,
                    resetTokenExpires,
                    updatedAt,
                    createdAt,
                    updatedBy,
                    createdBy,
                    contactDetails: {
                        createdAt: contactCreatedAt,
                        updatedAt: contactUpdatedAt,
                        ...restContactDetails
                    },
                    ...userData
                } = action.payload;
                state.user = {
                    ...userData,
                    contactDetails: restContactDetails,
                };
                state.loading = false;
                state.error = null;
            })
            .addCase(updateUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch user details";
            });
    },
});

export default userSlice.reducer;