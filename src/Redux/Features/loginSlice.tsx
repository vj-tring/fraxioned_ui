import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the interface for the initial state
interface InitialState {
    email: string
    password: string
}

// Define the initial state
const initialState: InitialState = {
    email: '',
    password: '',
}

// Create the login slice
export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLogin: (
            state,
            action: PayloadAction<{ email: string; password: string }>
        ) => {
            state.email = action.payload.email
            state.password = action.payload.password
        },
    },
})

// Export actions and reducer
export const { setLogin } = loginSlice.actions
export default loginSlice.reducer
