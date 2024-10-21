import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCategory, getCategories, updateCategory, deleteCategory } from '@/api/api-endpoints';

interface CategoryState {
  data: {
    id: number;          
    categoryName: string; 
  }[];
  loading: boolean;
  error: string | null;
  success: boolean;
  addSuccess: boolean;
  editSuccess: boolean;  
  deleteSuccess: boolean; 
}

const initialState: CategoryState = {
  data: [],
  loading: false,
  error: null,
  success: false,
  addSuccess: false,
  editSuccess: false,  
  deleteSuccess: false, 
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

export const editCategoryAsync = createAsyncThunk(
  'categories/editCategory',
  async ({id,payload}:{id:number, payload:{categoryName:string,updatedBy:{id:number}}},{ rejectWithValue }) => {
    try {
      const response = await updateCategory(id,payload)
      return response.data; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while updating the category');
    }
  }
);

export const deleteCategoryAsync = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteCategory(id);
      return response.data;
    } catch (error: any) {
      if(error.response.status === 500){
        return error.response.data;
      }
      return rejectWithValue(error.response?.data?.message || 'An error occurred while deleting the category');
    }
  }
);

// Category slice
const addCategorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetAddCategoryState: (state) => {
      state.addSuccess = false;
    },
    resetEditCategoryState: (state) => {
      state.editSuccess = false;
    },
    resetDeleteCategoryState: (state) => {
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Add category
    builder
      .addCase(addCategoryName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategoryName.fulfilled, (state, action) => {
        state.loading = false;
        state.addSuccess = true;
        state.data.push(action.payload); // Push newly created category into data
      })
      .addCase(addCategoryName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Update state with fetched categories
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Edit category
    builder
      .addCase(editCategoryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.editSuccess = true;
        const index = state.data.findIndex((cat) => cat.id === action.payload.id);
        if (index !== -1) {
          // Update the category in the state
          state.data[index] = { ...state.data[index], categoryName: action.payload.categoryName };
        }
      })
      .addCase(editCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete category
    builder
      .addCase(deleteCategoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.deleteSuccess = true;
        state.data = state.data.filter((category) => category.id !== action.payload); // Remove deleted category
      })
      .addCase(deleteCategoryAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetAddCategoryState, resetEditCategoryState, resetDeleteCategoryState } = addCategorySlice.actions;

export default addCategorySlice.reducer;
