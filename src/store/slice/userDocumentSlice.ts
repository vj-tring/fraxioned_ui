import { getUserPropertyDocument, createUserPropertyDocuments, updateUserPropertyDocument, deleteUserPropertyDocument, getAllUserPropertyDocuments } from "@/api/api-endpoints";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface UserPropertyDocument {
  documentName: any;
  documentUrl(documentUrl: any, arg1: string): unknown;
  property: any;
  id: number;
  user: { id: number };
  createdBy: { id: number };
  updatedBy?: { id: number };
  name: string;
  documentType: string;
  documentFile: File | null;
}

export interface UserPropertyDocumentState {
  documents: UserPropertyDocument[];
  currentDocument: UserPropertyDocument | null;
  isLoading: boolean;
  error: string | null;
}

// Create async thunks for CRUD operations
export const fetchUserPropertyDocuments = createAsyncThunk(
  "userPropertyDocuments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUserPropertyDocuments();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserPropertyDocument = createAsyncThunk(
  "userPropertyDocuments/fetchOne",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getUserPropertyDocument(id);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.data);
    }
  }
);

export const createUserPropertyDocumentThunk = createAsyncThunk(
  "userPropertyDocuments/create",
  async (documentData: FormData, { rejectWithValue }) => {
    try {
      const response = await createUserPropertyDocuments(documentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserPropertyDocumentThunk = createAsyncThunk(
  "userPropertyDocuments/update",
  async ({ id, documentData }: { id: number; documentData: FormData }, { rejectWithValue }) => {
    try {
      const response = await updateUserPropertyDocument(id, documentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUserPropertyDocumentThunk = createAsyncThunk(
  "userPropertyDocuments/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteUserPropertyDocument(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create the slice
const userPropertyDocumentsSlice = createSlice({
  name: "userPropertyDocuments",
  initialState: {
    documents: [],
    currentDocument: null,
    isLoading: false,
    error: null,
  } as UserPropertyDocumentState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentDocument: (state, action: PayloadAction<UserPropertyDocument | null>) => {
      state.currentDocument = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all documents
      .addCase(fetchUserPropertyDocuments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserPropertyDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(fetchUserPropertyDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single document
      .addCase(fetchUserPropertyDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserPropertyDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDocument = action.payload;
      })
      .addCase(fetchUserPropertyDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create document
      .addCase(createUserPropertyDocumentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUserPropertyDocumentThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents.push(action.payload);
      })
      .addCase(createUserPropertyDocumentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update document
      .addCase(updateUserPropertyDocumentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserPropertyDocumentThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.documents.findIndex((doc) => doc.id === action.payload.id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
        state.currentDocument = action.payload;
      })
      .addCase(updateUserPropertyDocumentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete document
      .addCase(deleteUserPropertyDocumentThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserPropertyDocumentThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = state.documents.filter((doc) => doc.id !== action.payload);
        if (state.currentDocument && state.currentDocument.id === action.payload) {
          state.currentDocument = null;
        }
      })
      .addCase(deleteUserPropertyDocumentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentDocument } = userPropertyDocumentsSlice.actions;
export default userPropertyDocumentsSlice.reducer;