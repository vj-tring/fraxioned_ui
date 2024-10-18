import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCategory,getCategories} from '@/api'; 

interface CategoryState {
    data: {
      categoryName: string; id: number; name: string 
}[];
    loading: boolean;
    error: string | null;
    success: boolean;
    addSuccess: boolean;
  }
  
  const initialState: CategoryState = {
    data: [],
    loading: false,
    error: null,
    success: false,
    addSuccess: false,
  };
  
  
export const addCategoryName = createAsyncThunk(
  'categories/addCategoryName',
  async (data: { createdBy: { id: number }; categoryName: string }, { rejectWithValue }) => {
    try {
      const response = await createCategory(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while adding the category');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategories();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while fetching categories');
    }
  }
);


const addCategorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetAddCategoryState: (state) => {
      state.addSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCategoryName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategoryName.fulfilled, (state, action) => {
        state.loading = false;
        state.addSuccess = true;
        state.data.push(action.payload);
      })
      .addCase(addCategoryName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAddCategoryState } = addCategorySlice.actions;
export default addCategorySlice.reducer;
