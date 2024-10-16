import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PropertyDocumentState, PropertyDocument } from "@/store/model";
import {
  fetchPropertyDocuments,
  fetchPropertyDocument,
  createPropertyDocumentThunk,
  updatePropertyDocumentThunk,
  deletePropertyDocumentThunk,
} from "./actions";

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
    setCurrentDocument: (
      state,
      action: PayloadAction<PropertyDocument | null>
    ) => {
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
        const index = state.documents.findIndex(
          (doc) => doc.id === action.payload.id
        );
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
        state.documents = state.documents.filter(
          (doc) => doc.id !== action.payload
        );
        if (
          state.currentDocument &&
          state.currentDocument.id === action.payload
        ) {
          state.currentDocument = null;
        }
      })
      .addCase(deletePropertyDocumentThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentDocument } =
  propertyDocumentsSlice.actions;
export * from "./actions";
export default propertyDocumentsSlice.reducer;
