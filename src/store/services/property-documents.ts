import { axiosInstance } from "../axiosSetup";

export const getPropertyDocuments = () =>
  axiosInstance.get("/property-documents");

export const getPropertyDocumentByProperty = (propertyId: number) =>
  axiosInstance.get(`/property-documents/property/${propertyId}`);

export const createPropertyDocuments = (formData: FormData) => {
  return axiosInstance.post("/property-documents", formData, {});
};

export const updatePropertyDocument = (id: number, formData: FormData) =>
  axiosInstance.patch(`/property-documents/property-document/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deletePropertyDocument = (id: number) =>
  axiosInstance.delete(`/property-documents/property-document/${id}`);
