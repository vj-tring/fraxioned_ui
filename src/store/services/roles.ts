import { axiosInstance } from "../axiosSetup";

export const getRoles = () => axiosInstance.get("/roles");
