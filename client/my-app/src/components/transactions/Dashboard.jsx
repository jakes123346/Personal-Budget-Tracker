import {useState} from "react";
import CategoryUI from "./CategoryUI";
import TransactionUI from "./TransactionUI";
import BudgetUI from "./BudgetUI";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../transactions/api";
import "../../styles/dashboard.css";

 
export default function Dashboard(){
    const [activeTab, setActiveTab] = useState("categories")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


    return (
        <div className="analytics-container">
            <nav className = "navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                <a className="navbar-brand fw-bold fs-3"  href="/">Personal Finance Dashboard</a>
                <div className="ms-auto">
                    <button
                    className="btn btn-outline-light me-2"
                    onClick={() => navigate('/analytics')}>View Analytics Charts</button>
                    <button
                    className="btn btn-warning"
                    onClick={() => navigate('/')}>Logout</button>
                </div>
                </div>
            </nav>

            

            {/* Navigation Tabs */}
            <ul className="nav nav-tabs justify-content-center mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "categories" ? "active" : ""}`}
                        onClick={() => setActiveTab("categories")}
                       
                    >
                        Categories
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "transactions" ? "active" : ""}`}
                        onClick={() => setActiveTab("transactions")}
                    >
                        Transactions
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === "budgets" ? "active": ""}`}
                        onClick={() => setActiveTab("budgets")}
                    >
                        Budgets 
                    </button>
                </li>
            </ul>

            {/* Content */}
            <div className="card shadow p-3">
                {activeTab === "categories" && <CategoryUI/>}
                {activeTab === "transactions" && <TransactionUI />}
                {activeTab === "budgets" && <BudgetUI/>}
            </div>
        </div>
    );
}

