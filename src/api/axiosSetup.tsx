import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "@/components/snackbar-provider";
import React, { ReactNode, useLayoutEffect } from "react";
import { BACKEND_URL } from "@/constants";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";


// const navigate = useNavigate();
// const { showSnackbar } = useSnackbar();
// const { handleUnauthorized } = createAuthHelpers(navigate, showSnackbar);

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  // timeout: 50000,
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
          // Get the access token from local storage or state
          // const user = JSON.parse(localStorage.getItem("user") || "{}");
          // const user = useSelector((state: RootState) => state.auth.user);
          const session = JSON.parse(localStorage.getItem("session") || "{}");
          const userId = session.userId;
          const token = session.token;
          const searchParams = new URLSearchParams(window.location.search);
          const resetToken = searchParams.get("resetToken");
          // If the access token exists, set it in the Authorization header
          if (userId && token ) {
            config.headers["user-id"] = userId;
            config.headers["access-token"] = token;
          }

          if (resetToken) {
            config.headers["resetToken"] = resetToken;
          }

          const isImageUpload =
            (config.url?.includes('/propertyImages') || config.url?.includes('/spaces/space') || config.url?.includes('/properties/property')) || config.url?.includes('/property-space-images') &&
            (config.method === 'post' || config.method === 'patch');

          if (isImageUpload) {
            config.headers["Content-Type"] = "multipart/form-data";
            config.headers["Accept"] = "*/*";
          } else {
            config.headers["Content-Type"] = "application/json";
            config.headers["Accept"] = "application/json";
          }

          return config;
        },
        (error) => {
          // Handle the request error here
          return Promise.reject(error);
        }
      );

      // Add a response interceptor
      responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => {
          // Any status code that lies within the range of 2xx causes this function to trigger
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
              console.log("inside auth helpers");
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
