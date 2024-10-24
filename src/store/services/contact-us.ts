import { axiosInstance } from "../axiosSetup";
import { ContactMessage } from "../model/contact-message";

export const sendContactMessage = (payload: ContactMessage) =>
    axiosInstance.post("/contact-us", payload);