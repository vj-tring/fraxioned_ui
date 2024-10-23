import { axiosInstance } from "../axiosSetup";

export const addAmenityGroup = (data: {
  createdBy: { id: number };
  name: string;
}) => axiosInstance.post("/amenity-groups/amenity-group", data);

export const getAllAmenityGroup = () => axiosInstance.get(`/amenity-groups`);

export const getAmenityGroupById = (id: number) =>
  axiosInstance.get(`/amenity-groups/amenity-group/${id}`);
