import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from '../../reducers';
import { addPropertyApi } from '@/store/service';

export interface AddPropertyState {
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

const initialState: AddPropertyState = {
    loading: false,
    successMessage: null,
    errorMessage: null,
};

const addPropertySlice = createSlice({
    name: 'addProperty',
    initialState,
    reducers: {
        addPropertyStart: (state) => {
            state.loading = true;
            state.successMessage = null;
            state.errorMessage = null;
        },
        addPropertySuccess: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.successMessage = action.payload;
            state.errorMessage = null;
        },
        addPropertyFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.successMessage = null;
            state.errorMessage = action.payload;
        },
        clearState: (state) => {
            state.loading = false;
            state.successMessage = null;
            state.errorMessage = null;
        },
    },
});

export const {
    addPropertyStart,
    addPropertySuccess,
    addPropertyFailure,
    clearState,
} = addPropertySlice.actions;

export default addPropertySlice.reducer;

export const addProperty =
    (propertyData: {
        createdBy: { id: number };
        propertyName: string;
        ownerRezPropId: number;
        address: string;
        city: string;
        state: string;
        country: string;
        zipcode: number;
        houseDescription: string;
        isExclusive: boolean;
        propertyShare: number;
        latitude: number;
        longitude: number;
        isActive: boolean;
        displayOrder: number;
    }): AppThunk<void> =>
        async (dispatch: Dispatch) => {
            try {
                dispatch(addPropertyStart());
                const response = await addPropertyApi(propertyData)
                const data = response.data;

                if (response.status === 201 || response.status === 200) {
                    dispatch(addPropertySuccess('Property added successfully!'));
                } else {
                    dispatch(addPropertyFailure('Failed to add property.'));
                }
            } catch (error: any) {
                if (error.response) {
                    const { status, data } = error.response;

                    if (status === 500) {
                        dispatch(addPropertyFailure('Server error, please try again later.'));
                    } else {
                        dispatch(
                            addPropertyFailure(data.message || 'An error occurred. Please try again.')
                        );
                    }
                } else {
                    dispatch(addPropertyFailure('An error occurred. Please try again.'));
                }
            }
        };
