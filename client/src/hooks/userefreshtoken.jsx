import axios from '../api/axios';
import useAuth from './authuse';

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();

    const refresh = async () => {
        try {
            const response = await axios.get('/routes/refresh', {
                withCredentials: true
            });

            const { accessToken, id, username, profilePicture, roles } = response?.data;

            // Update auth state with new accessToken and user info
            setAuth(prev => ({
                ...prev,
                accessToken,
                id: id || prev.id,
                user: username || prev.user,
                profilePicture: profilePicture || prev.profilePicture,
                roles: roles || prev.roles
            }));

            return accessToken;
        } catch (err) {
            console.error('Refresh failed:', err.response?.status, err.response?.data);
            throw err; // Propagate error for debugging
        }
    };

    return refresh;
};

export default useRefreshToken;
