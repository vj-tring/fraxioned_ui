import { axiosInstance } from "../axiosSetup";

export const createSpace = (spaceData: FormData) =>
  axiosInstance.post(`/spaces/space`, spaceData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getAllSpaces = () => axiosInstance.get(`/spaces`);

export const updateSpace = (id: number, spaceData: FormData) =>
  axiosInstance.patch(`/spaces/space/${id}`, spaceData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteSpace = (id: number) =>
  axiosInstance.delete(`/spaces/space/${id}`);
