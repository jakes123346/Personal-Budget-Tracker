import React from "react";
import { Navigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        console.error('Token decoding error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
