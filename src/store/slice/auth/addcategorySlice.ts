import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createCategory, getCategories, updateCategory, deleteCategory } from '@/api/api-endpoints';

interface CategoryState {
  data: {
    id: number;          // Unique identifier for the category
    categoryName: string; // Name of the category
  }[];
  loading: boolean;
  error: string | null;
  success: boolean;
  addSuccess: boolean;
  editSuccess: boolean;  // Track edit success
  deleteSuccess: boolean; // Track delete success
}

const initialState: CategoryState = {
  data: [],
  loading: false,
  error: null,
  success: false,
  addSuccess: false,
  editSuccess: false,  // Initial state for edit success
  deleteSuccess: false,  // Initial state for delete success
};

// Add a new category
export const addCategoryName = createAsyncThunk(
  'categories/addCategoryName',
  async (data: { createdBy: { id: number }; categoryName: string }, { rejectWithValue }) => {
    try {
      const response = await createCategory(data);
      return response.data;  // Assuming the response includes the newly created category
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while adding the category');
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCategories();
      return response.data.data; // Assuming this structure contains the list of categories
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while fetching categories');
    }
  }
);

// Edit category (Update category)
export const editCategoryAsync = createAsyncThunk(
  'categories/editCategory',
  async (data: { id: number; categoryName: string }, { rejectWithValue }) => {
    try {
      const response = await updateCategory(data.id, {
        categoryName: data.categoryName,
        createdBy: { id: 0 } // Adjust as per your requirements
      });
      return { id: data.id, categoryName: data.categoryName }; // Return ID and updated name
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred while updating the category');
    }
  }
);

// Delete category
export const deleteCategoryAsync = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteCategory(id);
      return id; // Return the ID for successful deletion
    } catch (error: any) {
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
