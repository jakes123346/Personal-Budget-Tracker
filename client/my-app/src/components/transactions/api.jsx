// Centralized API Setup, automatically attaches auth tokens 
// and keep API calls cleaner and more secure

import axios from "axios";

// Configure axios instance
const API = axios.create({
    baseURL: "http://127.0.0.1:8080/api/transactions/",
});

// Add interceptor for JWT tokens
API.interceptors.request.use((config) =>{
    const token = localStorage.getItem("token");
    if (token){
        config.headers.Authorization = `Bearer ${token}`; 
        console.log('Token Found')
    }
    else{
        console.log('Token not Found')
    }
    return config
});

export default API;