import { getUserPropertyDocument, createUserPropertyDocuments, updateUserPropertyDocument, deleteUserPropertyDocument, getAllUserPropertyDocuments, getUserPropertyDocumentByUser } from "@/api/api-endpoints";
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
export const fetchUserPropertyDocumentByUser = createAsyncThunk(
  "userPropertyDocuments/fetchAllByUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getUserPropertyDocumentByUser(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
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