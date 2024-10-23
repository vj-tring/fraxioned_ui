import { axiosInstance } from "../axiosSetup";

export const fetchFaqs = () => {
  return axiosInstance.get("/faq-questions");
};

export const getFaqQuestionsByCategoryId = (id: number) =>
  axiosInstance.get(`/faq-questions/question/${id}`);

export const createFaqQuestion = (data: {
  question: string;
  answer: string;
  createdBy: { id: number };
}) => {
  return axiosInstance.post("/faq-questions/question", data);
};

export const updateFaqQuestion = (
  id: number,
  data: { question: string; answer: string; updatedBy: { id: number } }
) => {
  return axiosInstance.patch(`/faq-questions/question/${id}`, data);
};

export const deleteFaqQuestion = (id: number) => {
  return axiosInstance.delete(`/faq-questions/question/${id}`);
};
