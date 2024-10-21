import { getPropertyDocuments, updatePropertyDocument, deletePropertyDocument, createPropertyDocuments, getPropertyDocumentByProperty } from "@/api/api-endpoints";
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
  data: any;
  status: any;
  propertyCodes: any;
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

export const fetchPropertyDocumentsByProperty = createAsyncThunk(
  "propertyDocuments/fetchAllByProperty",
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const response = await getPropertyDocumentByProperty(propertyId);
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

