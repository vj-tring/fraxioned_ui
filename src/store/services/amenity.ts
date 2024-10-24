import { axiosInstance } from "../axiosSetup";

export const getAllAmenities = () => axiosInstance.get(`/amenities`);

export const addAmenity = (data: FormData) =>
  axiosInstance.post("/amenities/amenity", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updateAmenities = (id: number, updateData: FormData) =>
  axiosInstance.patch(`/amenities/amenity/${id}`, updateData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteAmenity = (id: number) =>
  axiosInstance.delete(`/amenities/amenity/${id}`);
