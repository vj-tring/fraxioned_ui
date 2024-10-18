import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createQuestion } from '@/api';

interface AddQuestionData {
  question: string;
  answer: string;
  createdBy: { id: number }; 
}

export interface AddQuestionState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const addQuestion = createAsyncThunk(
  'questions/addQuestion',
  async (data: AddQuestionData, { rejectWithValue }) => {
    try {
      const response = await createQuestion(data)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

const initialState: AddQuestionState = {
  loading: false,
  error: null,
  success: false,
};

const addQuestionSlice = createSlice({
  name: 'addQuestion',
  initialState,
  reducers: {
    resetAddQuestionState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addQuestion.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(addQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetAddQuestionState } = addQuestionSlice.actions;
export default addQuestionSlice.reducer;
