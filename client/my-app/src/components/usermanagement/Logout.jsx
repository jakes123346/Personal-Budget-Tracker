import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        sessionStorage.clear();

        window.history.pushState(null,"","/");
        window.addEventListener("popstate",() => {
            window.history.pushState(null,"","/");
        });

        navigate('/',{ replace: true });
    }, [navigate]);

    return (
        <div>
            <h2>You have been logged out.</h2>
        </div>
    );
}
export default Logout;