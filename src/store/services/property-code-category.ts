import { axiosInstance } from "../axiosSetup";

export const getAllPropertyCodeCatogory = () =>
  axiosInstance.get(`/property-code-categories`);

export const createPropertyCodeCatogory = (data: {
  name: string;
  createdBy: { id: number };
}) => axiosInstance.post(`/property-code-categories`, data);
