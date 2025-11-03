import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Login.css";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:9090/api/users/login/', { email, password });
            localStorage.setItem('token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', response.data.user_id);

            if (response.data.message === "Login Successful") {
                navigate('/dashboard');
            } else {
                setError('Login failed. Please try again.');
            }
    }catch(error){
        console.error('Login error:', error.response?.data || error.message);
        if (error.response){
            if (error.response.data.error === "Invalid email"){
                setError('Email not found. Please register first.');
            }
            else if (error.response.data.error === "Incorrect password"){
                setError('Incorrect password. Please try again.');
            }
            else {
                setError('An unexpected error occurred. Please try again later.');
            }   
        }else{
            setError('Unable to connect to the server. Please try again later.');   
        }

    } finally {
        setLoading(false);
    }
}
    return (
        <div className="login-wrapper d-flex justify-content-center align-items-center vh-100 position-relative">
            <button className="btn btn-link position-absolute top-0 start-0 m-3" style = {{top: "20px", right:"20px"}} onClick={() => navigate("/")}>
                Home    
            </button>
            <div classname = "card shadow-lg border-0 rounded-4" style={{width:'28rem'}}>
                <div className="card-body p-4"> 
                    <h3 className = "card-title mb-4 text-center fw-bold">Login</h3>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <form onSubmit={handleSubmit} classname = "login-form">
                        <div className="form-group mb-3">
                            <label className="form-labelemail">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder='Enter registered Email'
                                value={email}  
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label password">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder='Enter Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-3"> {loading ? "Logging in ..." : "Login"}
                
                        </button>
                    </form>
                    </div>
            </div>
        </div>
    );
}
export default Login;