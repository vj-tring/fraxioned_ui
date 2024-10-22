import { axiosInstance } from "../axiosSetup";

export const getAllUsers = () => axiosInstance.get("/users");

export const getUserById = (id: number) =>
  axiosInstance.get(`/users/user/${id}`);

export const updateUser = (id: number, data: any) =>
  axiosInstance.patch(`/users/user/${id}`, data);
