import { getPropertyDocuments, getPropertyDocument, createPropertyDocument, updatePropertyDocument, deletePropertyDocument } from "@/api/api-endpoints";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface PropertyDocument {
  id: number;
  property: { id: number };
  createdBy: { id: number };
  updatedBy?: { id: number };
  name: string;
  documentType: string;
  documentFile: File | null;
}

export interface PropertyDocumentState {
  documents: PropertyDocument[];
  currentDocument: PropertyDocument | null;
  isLoading: boolean;
  error: string | null;
}

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
      const response = await createPropertyDocument(documentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
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
      await deletePropertyDocument(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the slice
const propertyDocumentsSlice = createSlice({
  name: "propertyDocuments",
  initialState: {
    documents: [],
    currentDocument: null,
    isLoading: false,
    error: null,
  } as PropertyDocumentState,
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
      // Fetch all documents
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
        state.documents.push(action.payload);
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
        const index = state.documents.findIndex((doc) => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
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
        state.documents = state.documents.filter((doc) => doc.id !== action.payload);
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