import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../components/snackbar-provider';
export const useAuthHelpers = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar(); 
    const handleUnauthorized = () => {
        showSnackbar('Your session is invalid. Please log in again.', 'error');
        localStorage.clear();
        navigate('/login');
    };

    return { handleUnauthorized };
};
