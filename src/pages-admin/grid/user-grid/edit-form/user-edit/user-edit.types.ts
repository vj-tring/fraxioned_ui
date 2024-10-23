import { User } from "@/store/model";

export interface EditFormProps {
    user: User;
    onClose: () => void;
    onUserUpdated: () => void;
    showCloseIcon?: boolean;
    formTitle?: string;
    isAdmin?: boolean;
}