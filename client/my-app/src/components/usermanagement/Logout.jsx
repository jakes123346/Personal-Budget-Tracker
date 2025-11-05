import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout =async () => {
    const navigate = useNavigate();
    useEffect(() => {
        const logoutUser = async () => {
            try {
                const refresh_token = localStorage.getItem('refresh_token');
                await axios.post('http://localhost:8000/api/logout/', {
                    refresh: refresh_token,
                });
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                window.location.reload(true);
                // navigate('/login');
            } catch (error) {
                console.error('Error during logout:', error);
            }
        };

        logoutUser();
    }, [navigate]);

    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
}
export default Logout;