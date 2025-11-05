import React from "react";
import "../../styles/Analytics.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  BarChart,
  LineChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
} from "recharts";
const Analytics = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [mode, setMode] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const refresh_token = localStorage.getItem("refresh_token");
  console.log("Token in Analytics:", token);
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A569BD",
    "#d32f2f",
    "#6A1B9A",
    "#43A047",
    "#5DADE2",
    "#48C9B0",
  ];
    const fetchAnalytics = async () => {
        if (!year) {
          alert("Please select a year");
          return;
        }
        if (mode === "monthly" && !month) {
          alert("Please select a month for monthly analytics");
          return;
        }
        setLoading(true);
        setShowResults(false);
    try {
          let url = `http://127.0.0.1:9090/api/analytics/summary/?year=${year}&mode=${mode}`;
          if (mode === "monthly" && month) url += `&month=${month}`;
          const res = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          console.log("Response here:", res.data);
          setExpenseData(res.data.expense_data || []);
          setIncomeData(res.data.income_data || []);
          setBudgetData(res.data.budget_data || []);
          setShowResults(true);
        } catch (error) {
          console.error("Error fetching analytics data:", error);
          alert("Failed to fetch analytics data. Please try again later.");
        } finally {
          setLoading(false);
        }
      };

      const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
        return (
          <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
            {`${(percent * 100).toFixed(1)}%`}
          </text>
        );
      }
    return (
        <div className="analytics-container">
            <nav className = "navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                <a className="navbar-brand fw-bold fs-3"  href="/">Analytics Dashboard</a>
                <div className="ms-auto">
                    <button 
                    className="btn btn-outline-light me-2" 
                    onClick={() => navigate('/dashboard')}>back</button>
                    <button 
                    className="btn btn-warning" 
                    onClick={() => navigate('/')}>Logout</button>
                </div>
                </div>
            </nav>
            <div className = "text-center mt-2">
                   <p className="text-muted mt-2" textAlign="center" >
                  Select filters and click "Show results" to view analytics.
                </p>

            </div>
               


          <div className="filter-section">
            <select onChange={(e) => setMonth(e.target.value)}>
              <option value="">Select Month</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
            <select onChange={(e) => setYear(e.target.value)}>
              <option value="">Select Year</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
            <select onChange={(e) => setMode(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button onClick={fetchAnalytics} className="btn btn-warning">
              {loading ? "Loading..." : "Show results"}
            </button>
          </div>

        {showResults && ( <div className="analytics-grid">
              <div className="chart-card">
                <h3>Income Overview</h3>
                {incomeData.length > 0 ? (
                  <>
                    <PieChart width={280} height={280}>
                      <Pie
                        data={incomeData}
                        dataKey="total_amount"
                        nameKey="category"
                        cx="63%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label = {renderCustomizedLabel}
                        labelLine = {false}
                      >
                        {incomeData.map((entry, index) => (
                          <Cell
                            key={`income-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                      formatter = {(value) =>[`₹${value.toLocaleString()}`,"Amount"]}
                      labelFormatter={(cat) => `Category: ${cat}`}
                      />
                      <Legend verticalAlign="bottom" />
                    </PieChart>
                    <BarChart width={300} height={300} data={incomeData} margin = {{left:35}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" label = {{value:"Category",position:"InsideBottom"}} />
                      <YAxis label = {{value:"Amount (₹)", angle : -90,position:"outsideLeft",fontSize:10,offset:-20}}
                      tick = {{fontSize:10,dx:-5}}
                      />
                      <Tooltip formatter = {(value)=> `₹${value.toLocaleString()}`}/>
                      <Legend verticalAlign="bottom"/>
                      <Bar dataKey="total_amount" fill="#82ca9d" />
                    </BarChart>
                  </>
                ) : (
                  <p>No income data available for the selected period.</p>
                )}
              </div>
    <div className="chart-card">
                <h3>Expense Overview</h3>
                {expenseData.length > 0 ? (
                  <>
                  <PieChart width={280} height={280}>
                    <Pie
                      data={expenseData}
                      dataKey="total_amount"
                      nameKey="category"
                      cx="63%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label = {renderCustomizedLabel}
                      labelLine = {false}
                    >
                      {expenseData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip                   
                      formatter = {(value) =>[`₹${value.toLocaleString()}`,"Amount"]}
                      labelFormatter={(cat) => `Category: ${cat}`} />
                    <Legend verticalAlign="bottom"/>
                  </PieChart>
                  <BarChart width={300} height={300} data={expenseData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" label = {{value:"Category",position:"InsideBottom"}} />
                      <YAxis label = {{value:"Amount (₹)", angle : -90,position:"outsideLeft",fontSize:10,offset:-20}}
                      tick = {{fontSize:10,dx:-5}}/>
                      <Tooltip formatter = {(value)=> `₹${value.toLocaleString()}`}/>
                      <Legend verticalAlign="bottom"/>
                      <Bar dataKey="total_amount" fill="#82ca9d" />
                    </BarChart>
                    </>

                ) : (
                  <p>No expense data available for the selected period.</p>
                )}
              </div>
    <div className="chart-card">
                <h3>Budget Overview</h3>
                {budgetData.length > 0 ? (
                  <BarChart width={300} height={300} data={budgetData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value)=> `(₹)${value}`} />
                    <Legend verticalAlign="bottom" height={36}/>
                    <Bar dataKey="budgeted_amount" fill="#8884d8" name = "Budgeted_amount" barsize = {20} />
                    <Bar dataKey="spent_amount" fill="#82ca9d" name = "Spent_amount" barsize = {20} />
                  </BarChart>
                ) : (
                  <p>No budget data available for the selected period.</p>
                )}
              </div>
            </div>
          )}
        </div>
      );
    };
export default Analytics;