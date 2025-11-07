// Centralized API Setup, automatically attaches auth tokens and keep API calls cleaner and more secure

import axios from "axios";

// Configure axios instance
const API = axios.create({
    baseURL: "http://127.0.0.1:9090/api/transactions/",
});

// Add interceptor for JWT tokens
API.interceptors.request.use((config) =>{
    const token = localStorage.getItem("token");
    if (token){
        config.headers.Authorization = `Bearer ${token}`; // get token
        console.log('Token Found')
    }
    else{
        console.log('Token not Found')
    }
    return config
});
// console.log(token)

//show a React component for debugging
// export function ApiStatus()
// {
//     const token = localStorage.getItem("access_token");
//     return(
//         <div style={{ padding: "10px", background: "#f8f9fa"}}>
//             <h4>API Connection</h4>
//             <p><strong>Base URL:</strong>{API.defaults.baseURL}</p>
//             <p><strong>Token found</strong>{token ? "Yes": "No"}</p>
//         </div>
//     );
// }

export default API;