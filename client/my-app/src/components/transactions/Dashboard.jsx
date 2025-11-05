import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import axios from "axios";

const Dashboard = () => {
  const username = "User"; // Replace this with dynamic username data if needed!
  const Navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const[error,setError] = useState(null);
  const token = localStorage.getItem('token');
  const refresh_token = localStorage.getItem('refresh_token');
  const[transactions,setTransactions] = useState([]);
  const [tokenPresent, setTokenPresent] = useState(false);

  // const fetchTransactions = async() => {
  //   setLoading(true);
  //   setError("");

  //   const token = localStorage.getItem('token');
  //   console.log("Token in Dashboard:", token);

  //   if(!token){
  //     setError("No authentication token found. Please login.");
  //     setLoading(false);
  //     return;
  //   }

  //   try{
  //     const response = await axios.get("http://127.0.0.1:9090/api/transactions/transactions/",{
  //       method: "GET",
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //     console.log(response)
  //     if (!response.ok){
  //       const errText = await response.text();
  //       throw new Error(`Error fetching transactions: ${errText}`);
  //     }
  //     const data = await response.json();
  //     console.log("Fetched transactions:", data);
  //     setTransactions(data);
  //   }
  //     catch(error){
  //       console.error("Error fetching transactions:", error);
  //       setError("Failed to fetch transactions. Please try again later.");
  //     }finally{
  //       setLoading(false);
  //     }      
  //   }
    useEffect(() => {
      const saved = localStorage.getItem('token');
      if (saved) setTokenPresent(true);
      else setTokenPresent(false);
    }, []);
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please login.");
        setLoading(false);
        return;
      }
      Navigate('/analytics');
    }
    return (
    <div className="dashboard-container">
      <h1 className = "text-2xl font-bold mb-4">Welcome,{username}!</h1>
      <button className = "show-results-btn" onClick={fetchTransactions}>Show Results</button>

      {loading && <p>Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && transactions.length > 0 && (
        <div className="mt-5">
          <h2 className="text-xl font-semibold mb-3">Your Transactions:</h2>
          <ul>
            {transactions.map((tx, index) => (
              <li key={index} className="mb-2 p-2 border-b">
                <strong>{tx.category}</strong> {tx.amount} ({tx.type})
                </li>
            ))}
          </ul>
        </div>
      )}
    </div> 
  );
}   

export default Dashboard;
          
 
  
