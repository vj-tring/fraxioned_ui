import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '@/store/reducers';
import { updatePropertyapi } from '@/api/api-endpoints';
import { UpdateProperty } from '@/store/model';

export interface EditPropertyState {
    loading: boolean;
    successMessage: string | null;
    errorMessage: string | null;
}

type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

const initialState: EditPropertyState = {
    loading: false,
    successMessage: null,
    errorMessage: null,
};

const editPropertySlice = createSlice({
    name: 'editProperty',
    initialState,
    reducers: {
        editPropertyStart: (state) => {
            state.loading = true;
            state.successMessage = null;
            state.errorMessage = null;
        },
        editPropertySuccess: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.successMessage = action.payload;
            state.errorMessage = null;
        },
        editPropertyFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.successMessage = null;
            state.errorMessage = action.payload;
        },
        clearEditPropertyState: (state) => {
            state.loading = false;
            state.successMessage = null;
            state.errorMessage = null;
        },
    },
});

export const {
    editPropertyStart,
    editPropertySuccess,
    editPropertyFailure,
    clearEditPropertyState,
} = editPropertySlice.actions;

export default editPropertySlice.reducer;

export const editProperty =
    (propertyId: number, propertyData: UpdateProperty): AppThunk<void> =>
        async (dispatch: Dispatch) => {
            try {
                // dispatch(editPropertyStart());

                const updatedPropertyData: UpdateProperty = {
                    ...propertyData,
                    updatedBy: {
                        id: 1
                    }
                };

                const response = await updatePropertyapi(propertyId, updatedPropertyData);
                console.log(response)

                if (response.status === 200) {
                    dispatch(editPropertySuccess('Property updated successfully!'));
                } else {
                    dispatch(editPropertyFailure('Failed to update property.'));
                }
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;

                    if (status === 500) {
                        dispatch(editPropertyFailure('Server error, please try again later.'));
                    } else {
                        dispatch(
                            editPropertyFailure(data.message || 'An error occurred. Please try again.')
                        );
                    }
                } else {
                    dispatch(editPropertyFailure('An error occurred. Please try again.'));
                }
            }
        };