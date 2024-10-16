import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPropertyDocuments, getPropertyDocument, createPropertyDocument, updatePropertyDocument, deletePropertyDocument } from "@/api";

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