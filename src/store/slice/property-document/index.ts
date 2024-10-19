import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PropertyDocument, fetchPropertyDocuments, fetchPropertyDocumentsByProperty, createPropertyDocumentThunk, updatePropertyDocumentThunk, deletePropertyDocumentThunk, PropertyDocumentState } from "./actions";

const initialState: PropertyDocumentState = {
  documents: null,
  currentDocument: null,
  isLoading: false,
  error: null,
};
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
      .addCase(fetchPropertyDocumentsByProperty.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPropertyDocumentsByProperty.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(fetchPropertyDocumentsByProperty.rejected, (state, action) => {
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
