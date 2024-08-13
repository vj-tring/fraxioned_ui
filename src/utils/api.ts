import axiosInstance from "./axiosSetup";

// login api
export const loginUser = (email: string, password: string) =>
  axiosInstance.post('/v1/authentication/login', { email, password });

// forgetpassword api
export const forgetPasswordApi = (email :string) => 
    axiosInstance.post('/v1/authentication/forgotPassword',{ email });

// resetpassword
export const resetPasswordApi = (oldPassword :string,newPassword :string,userId :number) => 
    axiosInstance.post('/v1/authentication/resetPassword',{oldPassword, newPassword, userId })

// recoverpassword
export const recoverPasswordApi = (newPassword: string) => 
    axiosInstance.post('/v1/authentication/recoverPassword',{newPassword});

//  properties api
export const getProperties = () =>
    axiosInstance.get('/v1/properties');

// roles api
export const getRoles = () =>
    axiosInstance.get('/v1/roles');

//sendinvite api
export const sendInvite = async (payload: any) =>
    axiosInstance.post('/v1/authentication/invite',payload);

//logout api
export const logoutUserApi = (token: string) =>
    axiosInstance.post('/v1/authentication/logout', { sessionToken: token });

export const Propertydetails = () =>
    axiosInstance.get('/v1/property-details');

export const PropertyGuestdetails = () =>
    axiosInstance.get('/v1/properties');

// export const NightsProperty = () =>
//         axiosInstance.post('/v1/properties');


export const propertywithDetails = () =>
    axiosInstance.get('/v1/properties/properties-with-details');



