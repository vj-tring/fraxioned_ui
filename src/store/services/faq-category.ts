import { axiosInstance } from "../axiosSetup";

export const getFAQCategories = () => axiosInstance.get(`/faq-categories`);

export const getFAQCategoryById = (id: number) =>
  axiosInstance.get(`/faq-categories/category/${id}`);

export const createFAQCategory = (data: {
  createdBy: { id: number };
  categoryName: string;
}) => {
  return axiosInstance.post("/faq-categories/category", data);
};

export const updateFAQCategory = (id: number, data: any) => {
  return axiosInstance.patch(`/faq-categories/category/${id}`, data);
};

export const deleteFAQCategory = (id: number) => {
  return axiosInstance.delete(`/faq-categories/category/${id}`);
};
