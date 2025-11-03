import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/Register.css";

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateInputs = () => {
        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            setError('All fields are required.');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return false;
        }   

        setError('');
        return true;
    };

    const handleUserRegisteration = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;

        try {
            const response = await axios.post('http://127.0.0.1:9090/api/users/register/', {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                username : username.trim(),
                email: email.trim(),
                password: password
            });
            if (response.data.message === "User registered successfully") {
                navigate('/login');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error.response?.data || error.message);
            if (error.response) {
                if (error.response.data.error === "Email already exists") {
                    setError('Email is already registered. Please use a different email.');
                } else if (error.response.data.error === "Username already exists") {
                    setError('Username is already taken. Please choose a different username.');
                } else {
                    setError('An unexpected error occurred. Please try again later.');
                }
            } else {
                setError('Unable to connect to the server. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    }
            // Any cleanup actions can be performed here
    return (
        <div className="register-wrapper d-flex justify-content-center align-items-center vh-100 position-relative">
            <button className="card shadow-lg border-0 rounded-4" style = {{width:'28rem'}} >
                <div className="card-body p-4"> 
                    <h3 className = "card-title mb-4 text-center fw-bold">Create Account</h3>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <form onSubmit={handleUserRegisteration} classname = "register-form">
                        <div className="form-group mb-3">
                            <label className="form-label first-name">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder='Enter First Name'
                                value={firstName}  
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">       
                            <label className="form-label last-name">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder='Enter Last Name'
                                value={lastName}  
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">       
                            <label className="form-label username">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder='Choose a Username'
                                value={username}  
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-labelemail">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder='Enter Email'
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
                        <div className="form-group mb-3">
                            <label className="form-label confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder='Confirm Password'
                                value={confirmPassword}  
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="register-btn btn btn-primary btn-block w-100" disabled={loading}>{loading ? "Registering...": "Register"} Register
                        </button>
                    </form>
                </div>
            </button>
        </div>
    );
};

export default Register;
    
