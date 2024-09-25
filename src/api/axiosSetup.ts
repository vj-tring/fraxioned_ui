
import axios from 'axios';
import { useAuthHelpers } from './useAuthHelper';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3008/api',
    timeout: 10000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the access token from local storage or state
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const session = JSON.parse(localStorage.getItem('session') || '{}');
        const userId = user.id;
        const token = session.token;
        const searchParams = new URLSearchParams(window.location.search);
        const resetToken = searchParams.get('resetToken');

        // If the access token exists, set it in the Authorization header
        if (userId && token) {
            console.log("setting the header")
            config.headers['user-id'] = userId;
            config.headers['access-token'] = token;
        }

        if (resetToken) {
            config.headers['resetToken'] = resetToken;
        }

        const isImageUpload = config.url?.includes('/propertyImages') &&
            (config.method === 'post' || config.method === 'patch');

        if (isImageUpload) {
            config.headers['Content-Type'] = 'multipart/form-data';
            config.headers['Accept'] = '*/*';
        } else {
            config.headers['Content-Type'] = 'application/json';
            config.headers['Accept'] = 'application/json';
        }

        return config;
    },
    (error) => {
        // Handle the request error here
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Any status code that lies within the range of 2xx causes this function to trigger
        return response;
    },
    (error) => {
        // Any status codes that falls outside the range of 2xx causes this function to trigger
        // You can handle specific errors here (e.g., refresh token on 401, show notifications on error, etc.)
        if (error.response.status === 401) {
            const { handleUnauthorized } = useAuthHelpers();
            handleUnauthorized();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

