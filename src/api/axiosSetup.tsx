import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@/components/snackbar-provider";
import React, { ReactNode, useLayoutEffect } from "react";
import { BACKEND_URL } from "@/constants";

const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
});

interface AxiosInterceptorProps {
  children: ReactNode;
}

const AxiosInterceptor: React.FC<AxiosInterceptorProps> = ({ children }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    let requestInterceptor: number;
    let responseInterceptor: number;

    const addInterceptors = () => {
      requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          const session = JSON.parse(localStorage.getItem("session") || "{}");
          const userId = user.id;
          const token = session.token;
          const searchParams = new URLSearchParams(window.location.search);
          const resetToken = searchParams.get("resetToken");

          if (userId && token) {
            config.headers["user-id"] = userId;
            config.headers["access-token"] = token;
          }

          if (resetToken) {
            config.headers["resetToken"] = resetToken;
          }

          const isImageUpload =
            (config.url?.includes('/propertyImages') || 
             config.url?.includes('/spaces/space') || 
             config.url?.includes('/properties/property') ||
             config.url?.includes('/property-space-images') || 
             config.url?.includes('/property-documents') ||
             config.url?.includes('/amenities/amenity')) &&
            (config.method === 'post' || config.method === 'patch');

          const isDeleteMultipleSpaceImages = 
            config.url === '/property-space-images' && config.method === 'delete';

          if (isImageUpload) {
            config.headers["Content-Type"] = "multipart/form-data";
            config.headers["Accept"] = "*/*";
          } else if (isDeleteMultipleSpaceImages) {
            config.headers["Content-Type"] = "application/json";
            config.headers["Accept"] = "application/json";
          } else {
            config.headers["Content-Type"] = "application/json";
            config.headers["Accept"] = "application/json";
          }

          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => {
          return response;
        },
        (error) => {
          try {
            const config = error.config;
            const requiresAuth =
              config.headers["user-id"] && config.headers["access-token"];

            if (
              requiresAuth &&
              error.response &&
              (error.response.status === 401 || error.response.status === 403)
            ) {
              localStorage.clear();
              showSnackbar(
                "Your session is invalid. Please log in again.",
                "error"
              );
              navigate("/login");
            }
          } catch (interceptorError) {
            console.error("Error in response interceptor:", interceptorError);
          }
          return Promise.reject(error);
        }
      );
    };

    addInterceptors();

    return () => {
      if (requestInterceptor) {
        axiosInstance.interceptors.request.eject(requestInterceptor);
      }
      if (responseInterceptor) {
        axiosInstance.interceptors.response.eject(responseInterceptor);
      }
    };
  }, [navigate]);

  return <>{children}</>;
};

export { axiosInstance };
export default AxiosInterceptor;