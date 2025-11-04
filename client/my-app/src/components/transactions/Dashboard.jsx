import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";

const Dashboard = () => {
  const username = "User"; // Replace this with dynamic username data if needed!
  const Navigate = useNavigate();

  return (
    <div className = "dashboard-container">
        <div className="dashboard-header">
            <h2>Your Transactions</h2>
            <button className="analytics-btn" onClick={()=>Navigate("/analytics")}>View Analytics</button>
        </div>
    <div style={styles.container}>
      <h1 style={styles.message}>Welcome, {username}!</h1>
      <p style={styles.text}>You are now logged in. Manage your budget efficiently!</p>
    </div>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#f0f4f8",
  },
  message: {
    fontSize: "2rem",
    color: "#4caf50",
    marginBottom: "10px",
  },
  text: {
    fontSize: "1rem",
    color: "#555",
  },
};

export default Dashboard;