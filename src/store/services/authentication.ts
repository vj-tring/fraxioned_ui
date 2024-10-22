import { axiosInstance } from "../axiosSetup";

export const loginUser = (email: string, password: string) =>
  axiosInstance.post("/authentication/login", { email, password });

export const forgetPassword = (email: string) =>
  axiosInstance.post("/authentication/forgotPassword", { email });

export const resetPassword = (
  oldPassword: string,
  newPassword: string,
  userId: number
) =>
  axiosInstance.post("/authentication/resetPassword", {
    oldPassword,
    newPassword,
    userId,
  });

export const recoverPassword = (newPassword: string) =>
  axiosInstance.post("/authentication/recoverPassword", { newPassword });

export const sendInvite = async (payload: any) =>
  axiosInstance.post("/authentication/invite", payload);

export const logoutUser = (token: string) =>
  axiosInstance.post("/authentication/logout", { sessionToken: token });
