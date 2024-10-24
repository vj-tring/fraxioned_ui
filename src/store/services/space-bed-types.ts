import { axiosInstance } from "../axiosSetup";
import {
    CreateSpaceBedTypeDto,
    UpdateSpaceBedTypeDto,
} from "../model";

export const getAllSpaceBedTypes = () => axiosInstance.get("/space-bed-types");

export const getSpaceBedTypeById = (id: number) =>
  axiosInstance.get(`/space-bed-types/space-bed-type/${id}`);

export const updateSpaceBedTypeDetail = (
  id: number,
  data: UpdateSpaceBedTypeDto,
  imageFile?: File
) => {
  const formData = new FormData();
  if (imageFile) {
    formData.append("imageFile", imageFile);
  }
  if (data.name) {
    formData.append("name", data.name);
  }
  if (data.description) {
    formData.append("description", data.description);
  }
  if (data.updatedBy) {
    formData.append("updatedBy", JSON.stringify(data.updatedBy));
  }
  return axiosInstance.patch(
    `/space-bed-types/space-bed-type/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const deleteSpaceBedType = (id: number) =>
  axiosInstance.delete(`/space-bed-types/space-bed-type/${id}`);

export const createSpaceBedType = (
  data: CreateSpaceBedTypeDto,
  imageFile: File
) => {
  const formData = new FormData();
  formData.append("imageFile", imageFile);

  formData.append("name", data.name);
  if (data.description) {
    formData.append("description", data.description);
  }
  formData.append("createdBy", JSON.stringify(data.createdBy));

  return axiosInstance.post("/space-bed-types/space-bed-type", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
