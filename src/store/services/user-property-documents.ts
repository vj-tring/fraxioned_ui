import { axiosInstance } from "../axiosSetup";

export const createUserPropertyDocuments = (formData: FormData) =>
  axiosInstance.post("/userPropertyDocuments/userPropertyDocument", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getAllUserPropertyDocuments = () =>
  axiosInstance.get("/userPropertyDocuments");

export const getUserPropertyDocument = (id: number) =>
  axiosInstance.get(`/userPropertyDocuments/userPropertyDocument/${id}`);

export const getUserPropertyDocumentByUser = (userId: number) =>
  axiosInstance.get(`/userPropertyDocuments/user/${userId}`);

export const updateUserPropertyDocument = (id: number, formData: FormData) =>
  axiosInstance.patch(
    `/userPropertyDocuments/userPropertyDocument/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

export const deleteUserPropertyDocument = (id: number) =>
  axiosInstance.delete(`/userPropertyDocuments/userPropertyDocument/${id}`);
