import { axiosInstance } from "../axiosSetup";

export const createPropertyAddditionalImage = (data: FormData) =>
  axiosInstance.post(`/property-additional-images`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getAdditionalImageforProperty = (propertyId: number) => {
  return axiosInstance.get(
    `/property-additional-images/property/${propertyId}`
  );
};
