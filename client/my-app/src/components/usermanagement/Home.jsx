import React from 'react';
import '../../styles/home.css';
import {useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import icon1 from '../../assets/Budget_image1.png';
import icon2 from '../../assets/Budget_image4.png';
import icon3 from '../../assets/Budget_image5.png';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <nav className = "navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                <a className="navbar-brand fw-bold fs-3" href="/">Personal Budget Tracker</a>
                <div className="ms-auto">
                    <button 
                    className="btn btn-outline-light me-2" 
                    onClick={() => navigate('/login')}>Login</button>
                    <button 
                    className="btn btn-warning" 
                    onClick={() => navigate('/register')}>Register</button>
                </div>
                </div>
            </nav>

            <header className="hero-section d-flex flex-column justify-content-center align-items-center text-center text-black">
                <h1 className="fw-bold display-4">Take Control of Your Finances</h1>
                <p className="lead mt-3">Track your income and expenses with ease.</p>  
                <div className = "mt-4">
                    <button className="btn btn-lg btn-primary me-3" onClick={() => navigate('/register')}>Get Started</button>
                    <button className="btn btn-lg btn-outline-light" onClick={() => navigate('/login')}>Login</button>
                </div>
            </header>

            <section className="features container-fluid text-center py-5"> 
                <div className="row">
                    <div className="col-md-4 ">
                        <img src = {icon1} alt="Feature 1" className="feature-icon"/>
                        <h4 className="mt-3">Easy Expense Tracking</h4>
                        <p>Quickly log your daily expenses and monitor your spending habits.</p>
                    </div>
                    <div className="col-md-4">
                        <img src = {icon2} alt="Feature 2" className="feature-icon"/>          
                        <h4 className="mt-3">Budget Planning</h4>
                        <p>Create and manage budgets to stay on top of your financial goals.</p>
                    </div>
                    <div className="col-md-4">
                        <img src = {icon3} alt="Feature 3" className="feature-icon"/>          
                        <h4 className="mt-3">Detailed Reports</h4>
                        <p>Generate reports to analyze your income and expenses over time.</p>
                    </div>
                </div>
            </section>
            <footer className="footer bg-dark text-white text-center py-3">
                <p className="mb-0">© {new Date().getFullYear()} Personal Budget Tracker. All rights reserved.</p>
            </footer>
                        
        </div>
    );
}

export default Home