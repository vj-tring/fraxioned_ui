import { getPropertyDocuments, getPropertyDocument, updatePropertyDocument, deletePropertyDocument, createPropertyDocuments } from "@/api/api-endpoints";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface PropertyDocument {
  id: number;
  documentUrl: string;
  documentName: string;
  documentType: string;
  property: { id: number; propertyName: string };
  createdAt: string;
  updatedAt: string;
  createdBy: { id: number };
  updatedBy: { id: number } | null;
}

export interface PropertyDocumentState {
  documents: {
    success: boolean;
    message: string;
    data: PropertyDocument[];
    statusCode: number;
  } | null;
  currentDocument: PropertyDocument | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PropertyDocumentState = {
  documents: null,
  currentDocument: null,
  isLoading: false,
  error: null,
};


// Create async thunks for CRUD operations
export const fetchPropertyDocuments = createAsyncThunk(
  "propertyDocuments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPropertyDocuments();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchPropertyDocument = createAsyncThunk(
  "propertyDocuments/fetchOne",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getPropertyDocument(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPropertyDocumentThunk = createAsyncThunk(
  "propertyDocuments/create",
  async (documentData: FormData, { rejectWithValue }) => {
    try {
      const response = await createPropertyDocuments(documentData);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else if (error.request) {
        return rejectWithValue('No response received from server');
      } else {
        return rejectWithValue('Error setting up the request');
      }
    }
  }
);
export const updatePropertyDocumentThunk = createAsyncThunk(
  "propertyDocuments/update",
  async ({ id, documentData }: { id: number; documentData: FormData }, { rejectWithValue }) => {
    try {
      const response = await updatePropertyDocument(id, documentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePropertyDocumentThunk = createAsyncThunk(
  "propertyDocuments/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deletePropertyDocument(id);
      if (response.data.success) {
        return id; 
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Create the slice
const propertyDocumentsSlice = createSlice({
  name: "propertyDocuments",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentDocument: (state, action: PayloadAction<PropertyDocument | null>) => {
      state.currentDocument = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPropertyDocuments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPropertyDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(fetchPropertyDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single document
      .addCase(fetchPropertyDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPropertyDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDocument = action.payload;
      })
      .addCase(fetchPropertyDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create document
      .addCase(createPropertyDocumentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPropertyDocumentThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.documents && state.documents.data) {
          state.documents.data.push(action.payload);
        } else {
          state.documents = {
            success: true,
            message: "Document created successfully",
            data: [action.payload],
            statusCode: 200
          };
        }
      })
      .addCase(createPropertyDocumentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update document
      .addCase(updatePropertyDocumentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePropertyDocumentThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.documents && state.documents.data) {
          const index = state.documents.data.findIndex((doc) => doc.id === action.payload.id);
          if (index !== -1) {
            state.documents.data[index] = action.payload;
          }
        }
        state.currentDocument = action.payload;
      })
      .addCase(updatePropertyDocumentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete document
      .addCase(deletePropertyDocumentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePropertyDocumentThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.documents && state.documents.data) {
          state.documents.data = state.documents.data.filter(doc => doc.id !== action.payload);
        }
        if (state.currentDocument && state.currentDocument.id === action.payload) {
          state.currentDocument = null;
        }
      })
      .addCase(deletePropertyDocumentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentDocument } = propertyDocumentsSlice.actions;
export default propertyDocumentsSlice.reducer;