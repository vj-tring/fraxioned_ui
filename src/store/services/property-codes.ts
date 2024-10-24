import { axiosInstance } from "../axiosSetup";

interface EditPropertyCodePayload {
  property: number;
  propertyCodeCategory: number;
  updatedBy: number;
  propertyCode: string;
}

export const getAllPropertyCodes = () => axiosInstance.get(`/property-codes`);

export const generatePropertyCode = (payload: {
  property: number;
  propertyCodeCategory: number;
  createdBy: number;
  propertyCode: string;
}) => axiosInstance.post(`/property-codes/property-code`, payload);
export const editPropertyCode = (
  id: number,
  payload: EditPropertyCodePayload
) => axiosInstance.patch(`/property-codes/property-code/${id}`, payload);

//delete a  property code
export const deletePropertyCode = (id: number) =>
  axiosInstance.delete(`/property-codes/property-code/${id}`);
