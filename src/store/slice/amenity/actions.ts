import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllAmenities,
  addAmenity,
  updateAmenities,
  deleteAmenity,
} from "@/store/services";

interface AddAmenityData {
  amenityGroup: { id: number };
  createdBy: { id: number };
  amenityName: string;
  amenityDescription: string;
  imageFile: File | null;
}
export const fetchAmenities = createAsyncThunk(
  "amenities/fetchAmenities",
  async () => {
    const response = await getAllAmenities();
    return response.data;
  }
);
export const createAmenity = createAsyncThunk(
  "amenities/addAmenity",
  async (data: AddAmenityData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("amenityGroup", JSON.stringify(data.amenityGroup));
      formData.append("createdBy", JSON.stringify(data.createdBy));
      formData.append("amenityName", data.amenityName);
      formData.append("amenityDescription", data.amenityDescription);

      if (data.imageFile) {
        formData.append("imageFile", data.imageFile);
      }

      const response = await addAmenity(formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "An error occurred"
      );
    }
  }
);
// export const createAmenity = createAsyncThunk(
//     'amenities/addAmenity',
//     async (data: Amenity, { rejectWithValue }) => {
//       try {
//         const response = await addamenity(data);
//         return response.data;
//       } catch (error: any) {
//         return rejectWithValue(error.response?.data?.message || 'An error occurred');
//       }
//     }
//   );

export const updateAmenity = createAsyncThunk(
  "amenities/updateAmenity",
  async (
    { id, updateData }: { id: number; updateData: FormData },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateAmenities(id, updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update amenity"
      );
    }
  }
);

export const deleteAmenityAsync = createAsyncThunk(
  "amenities/deleteAmenity",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteAmenity(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete amenity"
      );
    }
  }
);
