import React from "react";
import "../../styles/Analytics.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {PieChart, BarChart, LineChart,Pie,Cell,Tooltip,Legend,XAxis,YAxis,CartesianGrid, Bar} from 'recharts';

const Analytics = () => {
    const[month,setMonth] = useState('');
    const[year,setYear] = useState('');
    const[expenseData,setExpenseData] = useState([]);
    const[incomeData,setIncomeData] = useState([]);
    const[budgetData,setBudgetData] = useState([]);
    const[mode,setMode] = useState('monthly'); 
    
    const token = localStorage.getItem('token');
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD','#d32f2f','#6A1B9A','#43A047', '#5DADE2', '#48C9B0'];

    useEffect(() => {
        if(year){
            let url = `http://127.0.0.1:9090/api/analytics/summary/?year=${year}&mode=${mode}`;
            if(mode === 'monthly' && month) url += `&month=${month}`;
            axios.get(url, {
                headers: { Autorization: `Bearer ${token}` }
            })
            .then(response => {
                setExpenseData(response.data.expense_summary);
                setIncomeData(response.data.income_summary);
                setBudgetData(response.data.budget_summary);
            })
            .catch(error => {
                console.error('Error fetching analytics data:', error);
            });
        }
    }, [month, year, mode, token]);

    return (
        <div className="analytics-container">
            <div className = "filter-section">
                <select onChange = {(e) => setMonth(e.target.value)}>
                    <option value = "">Select Month</option>
                    <option value = "1">January</option>
                    <option value = "2">February</option>
                    <option value = "3">March</option>
                    <option value = "4">April</option>
                    <option value = "5">May</option>
                    <option value = "6">June</option>
                    <option value = "7">July</option>
                    <option value = "8">August</option>
                    <option value = "9">September</option>
                    <option value = "10">October</option>
                    <option value = "11">November</option>
                    <option value = "12">December</option>
                </select>
                <select onChange = {(e) => setYear(e.target.value)}>
                    <option value = "">Select Year</option>
                    <option value = "2023">2023</option>
                    <option value = "2024">2024</option>
                    <option value = "2025">2025</option>        
                </select>
                <select onChange = {(e) => setMode(e.target.value)}>
                    <option value = "monthly">Monthly</option>
                    <option value = "yearly">Yearly</option>      
                </select>
            </div>
            <div className = "analytics-grid">
                <div className="chart-card">
                    <h3>Income Overview</h3>
                    {incomeData.length > 0 ? (
                        <>
                        <PieChart width={400} height={300}>
                            <Pie
                                data={incomeData}
                                dataKey="amount"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {incomeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                        <BarChart width={500} height={300} data={incomeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="amount" fill="#82ca9d" />
                        </BarChart>
                        </>
                    ) : (
                        <p>No income data available for the selected period.</p>
                    )}
                </div>
                <div className="chart-card">
                    <h3>Expense Overview</h3>
                    {expenseData.length > 0 ? (
                        <PieChart width={400} height={300}>
                            <Pie
                                data={expenseData}
                                dataKey="amount"            
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                label
                            >
                                {expenseData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    ) : (
                        <p>No expense data available for the selected period.</p>
                    )}
                </div>
                <div className="chart-card">
                    <h3>Budget Overview</h3>
                    {budgetData.length > 0 ? (
                        <BarChart width={500} height={300} data={budgetData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="allocated_budget" fill="#8884d8" />
                            <Bar dataKey="spent_amount" fill="#82ca9d" />
                        </BarChart>
                    ) : (
                        <p>No budget data available for the selected period.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

