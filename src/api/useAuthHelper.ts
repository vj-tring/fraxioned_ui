import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/snackbar-provider';
import { NavigateFunction } from 'react-router-dom';

// Define the type for the showSnackbar function
type ShowSnackbarFunction = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => void;

export const createAuthHelpers = (navigate: NavigateFunction, showSnackbar: ShowSnackbarFunction) => {
    const handleUnauthorized = () => {
        showSnackbar('Your session is invalid. Please log in again.', 'error');
        localStorage.clear();
        console.log("inside auth helpers");
        navigate('/login');
    };

    return { handleUnauthorized };
};

export const useAuthHelpers = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    
    return createAuthHelpers(navigate, showSnackbar);
};