import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateQuestion, deleteQuestion, fetchFaqs } from '@/api'; 

export interface UpdateFaqPayload {
    id: number;
    updateData: {
      question: string;
      answer: string;
      updatedBy: {
        id: number;
      };
      categoryId: number;
    };
  }
  

export interface Faq {
    editMode: any;
    category: any;
    id: number;
    question: string;
    answer: string;
}

export interface FaqState {
    loading: boolean;
    error: string | null;
    success: boolean;
    deleteLoading: boolean;
    deleteError: string | null;
    deleteSuccess: boolean;
    faqs: Faq[]; 
}

const initialState: FaqState = {
    loading: false,
    error: null,
    success: false,
    deleteLoading: false,
    deleteError: null,
    deleteSuccess: false,
    faqs: [], 
};

export const fetchFaqAsync = createAsyncThunk<Faq[], void>(
    'faqPage/fetchFaqs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetchFaqs();
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch FAQs');
        }
    }
);

export const updateFaq = createAsyncThunk(
    'faqPage/updateFaq',
    async ({ id, updateData }: UpdateFaqPayload, { rejectWithValue }) => {
        try {
            const response = await updateQuestion(id, updateData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update FAQ');
        }
    }
);

export const deleteFaqAsync = createAsyncThunk(
    'faqpage/deleteFaq',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await deleteQuestion(id);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete FAQ');
        }
    }
);

const faqPageSlice = createSlice({
    name: 'faqPage',
    initialState,
    reducers: {
        resetFaqState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
            state.deleteLoading = false;
            state.deleteError = null;
            state.deleteSuccess = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFaqAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFaqAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.faqs = action.payload; // Set the fetched FAQs
                state.error = null;
            })
            .addCase(fetchFaqAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateFaq.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateFaq.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.success = true;
            })
            .addCase(updateFaq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.success = false;
            })
            .addCase(deleteFaqAsync.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
                state.deleteSuccess = false;
            })
            .addCase(deleteFaqAsync.fulfilled, (state) => {
                state.deleteLoading = false;
                state.deleteError = null;
                state.deleteSuccess = true;
            })
            .addCase(deleteFaqAsync.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload as string;
                state.deleteSuccess = false;
            });
    },
});

export const { resetFaqState } = faqPageSlice.actions;
export default faqPageSlice.reducer;
