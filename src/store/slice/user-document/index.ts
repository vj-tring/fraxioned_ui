import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createUserPropertyDocumentThunk, deleteUserPropertyDocumentThunk, fetchUserPropertyDocument, fetchUserPropertyDocumentByUser, fetchUserPropertyDocuments, updateUserPropertyDocumentThunk, UserPropertyDocument, UserPropertyDocumentState } from "./action";

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
      .addCase(fetchUserPropertyDocumentByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserPropertyDocumentByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(fetchUserPropertyDocumentByUser.rejected, (state, action) => {
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