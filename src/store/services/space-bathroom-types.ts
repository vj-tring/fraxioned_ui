import { axiosInstance } from "../axiosSetup";
import { CreateSpaceBathroomTypesDto, UpdateSpaceBathroomTypesDto } from "../model";

export const createSpaceBathroomType = (
  data: CreateSpaceBathroomTypesDto,
  imageFile: File
) => {
  const formData = new FormData();
  formData.append("imageFile", imageFile);
  formData.append("name", data.name);
  if (data.description) {
    formData.append("description", data.description);
  }
  formData.append("createdBy", JSON.stringify(data.createdBy));

  return axiosInstance.post(
    "/space-bathroom-types/space-bathroom-type",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const getAllSpaceBathroomTypes = () =>
  axiosInstance.get("/space-bathroom-types");

export const getSpaceBathroomTypeById = (id: number) =>
  axiosInstance.get(`/space-bathroom-types/space-bathroom-type/${id}`);
export const updateSpaceBathroomTypeById = (
  id: number,
  data: UpdateSpaceBathroomTypesDto,
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
  formData.append("updatedBy", JSON.stringify(data.updatedBy));

  return axiosInstance.patch(
    `/space-bathroom-types/space-bathroom-type/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const deleteSpaceBathroomTypeById = (id: number) =>
  axiosInstance.delete(`/space-bathroom-types/space-bathroom-type/${id}`);
