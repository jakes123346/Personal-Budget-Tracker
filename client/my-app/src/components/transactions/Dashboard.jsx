// import React from "react";
// import { useState, useEffect } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import "../../styles/dashboard.css";
// import axios from "axios";

// const Dashboard = () => {
//   const username = "User"; // Replace this with dynamic username data if needed!
//   const Navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const[error,setError] = useState(null);
//   const token = localStorage.getItem('token');
//   const refresh_token = localStorage.getItem('refresh_token');
//   const[transactions,setTransactions] = useState([]);
//   const [tokenPresent, setTokenPresent] = useState(false);

//     useEffect(() => {
//       const saved = localStorage.getItem('token');
//       if (saved) setTokenPresent(true);
//       else setTokenPresent(false);
//     }, []);
//     const fetchTransactions = async () => {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         setError("No authentication token found. Please login.");
//         setLoading(false);
//         return;
//       }
//       Navigate('/analytics');
//     }
//     return (
//     <div className="dashboard-container">
//       <h1 className = "text-2xl font-bold mb-4">Welcome,{username}!</h1>
//       <button className = "show-results-btn" onClick={fetchTransactions}>Show Results</button>

//       {loading && <p>Loading transactions...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && transactions.length > 0 && (
//         <div className="mt-5">
//           <h2 className="text-xl font-semibold mb-3">Your Transactions:</h2>
//           <ul>
//             {transactions.map((tx, index) => (
//               <li key={index} className="mb-2 p-2 border-b">
//                 <strong>{tx.category}</strong> {tx.amount} ({tx.type})
//                 </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div> 
//   );
// }   

// export default Dashboard;
          
import {useState} from "react";
import CategoryUI from "./CategoryUI";
import TransactionUI from "./TransactionUI";
import BudgetUI from "./BudgetUI";
 
export default function Dashboard(){
    const [activeTab, setActiveTab] = useState("categories")
    const NavigaetToAnalytics= async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please login.");
        setLoading(false);
        return;
      }
      Navigate('/analytics');
    }


    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Personal Finance Dashboard</h2>
            
            <button className = "show-results-btn" onClick={NavigaetToAnalytics}>Show Results</button>

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

