import { useState, useEffect } from "react";
import API from "../transactions/api";
import { Button } from "react-bootstrap";
import { Dropdown, Form } from 'react-bootstrap';
import "../../styles/dashboard.css";
import CategoryDropdown from "./CategoryDropdown";

export default function BudgetUI() {
    const [selectedCategories, setSelectedCategories] = useState(["all"]);

    const [mode, setMode] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [budgets, setBudgets] = useState([]);
    const [finalFilteredBudgets, setFilteredBudgets] = useState([])
    const [categories, setCategories] = useState([]);
    const [viewCategories, setViewCategories] = useState([])
    const [ManageBudgetMessage, setManageBudgetMessage] = useState({ type: "", text: "" });
    const [ViewBudgetMessage, setViewBudgetMessage] = useState({ type: "", text: "" })


    const [form, setForm] = useState({
        category_id: "",
        amount: "",
        month: "",
        year: "",
    });

    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (ManageBudgetMessage.type) {
            const timer = setTimeout(() => {
                setManageBudgetMessage({ type: '', text: '' }); // Clear the ManageBudgetMessage after 3 seconds
            }, 3000);
            return () => clearTimeout(timer); // Cleanup function to clear the timeout
        }
    }, [ManageBudgetMessage]);

    useEffect(() => {
        if (ViewBudgetMessage.type) {
            const timer = setTimeout(() => {
                setViewBudgetMessage({ type: '', text: '' }); // Clear the ManageBudgetMessage after 3 seconds
            }, 3000);
            return () => clearTimeout(timer); // Cleanup function to clear the timeout
        }
    }, [ViewBudgetMessage]);
    const getMonthName = (monthNumber) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthNumber - 1]; // Convert month number to name (1-12 map to array index 0-11)
    };
    // const [type, setType] = useState("all");
    // Fetch Budgets
    const fetchFilteredBudget = () => {
        // await fetchBudgets()
        if (mode === "monthly" && !month) {
            alert("please select a month")
            return
        }
        if (mode === "yearly" && !year) {
            alert("Please select a year")
            return
        }

        let filteredBudgets = budgets
        console.log(budgets)
        console.log(mode)
        console.log(year)
        console.log(month)

        if (mode && year && mode !== "" && year !== '') {
            if (mode === 'yearly' && year) {
                filteredBudgets = filteredBudgets.filter(
                    budget => budget['year'] === parseInt(year)


                );

            }
            if (mode === 'monthly' && year && month) {
                console.log(parseInt(year))
                filteredBudgets = filteredBudgets.filter(
                    budget => budget['year'] === parseInt(year)
                        && budget['month'] === parseInt(month)
                );

            }
            // Filter by selected categories if not "all"
            if (selectedCategories && !selectedCategories.includes('all')) {
                filteredBudgets = filteredBudgets.filter(budget =>
                    selectedCategories.includes(budget.category.name)
                );
                console.log(3, filteredBudgets)
            }
            setViewBudgetMessage({ type: "success", text: "Budget data fetched succesfully" });

            filteredBudgets.sort((a, b) => new Date(b.date) - new Date(a.date));
            console.log(filteredBudgets)
            console.log(4, filteredBudgets)
            // return filteredBudgets;
            setFilteredBudgets(filteredBudgets)
            console.log(finalFilteredBudgets)


        }
        else {
            setViewBudgetMessage({ type: "danger", text: "Please select inputs for all required fileds" });

        }
    }


    const fetchBudgets = async () => {
        try {
            const res = await API.get("budgets/")
            setBudgets(res.data)
            // setViewBudgetMessage({ type: "succes", text: "Budget Data fetched succesfully" });

        } catch (err) {
            console.error("Error fetching budgets:", err);
            // setViewBudgetMessage({ type: "danger", text: "Failed to fetch budgets." });
        }
    };

    const handleCategoryChange = (newCategories) => {
        console.log("Selected Categories:", newCategories);
        setSelectedCategories(newCategories);
    };

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const res = await API.get("categories/");
            setCategories(res.data);
            setViewCategories(res.data)
        } catch (err) {
            console.error("Error fetching categories:", err);
            setManageBudgetMessage({ type: "danger", text: "Failed to fetch categories." });
        }
    };

    useEffect(() => {
        fetchBudgets();
        fetchCategories();
    }, []);


    // Add or Update Budget
    const handleSubmit = async (e) => {
        console.log(form)
        e.preventDefault();
        try {
            if (editId) {
                await API.put(`budgets/${editId}/`, {
                    category_id: form.category_id,
                    amount: parseFloat(form.amount),
                    month: parseInt(form.month),
                    year: parseInt(form.year)
                });
                setManageBudgetMessage({ type: "success", text: "Budget updated successfully!" });
                setEditId(null);
            } else {
                await API.post("budgets/", {
                    category_id: form.category_id,
                    amount: parseFloat(form.amount),
                    month: parseInt(form.month),
                    year: parseInt(form.year)
                });
                setManageBudgetMessage({ type: "success", text: "Budget added successfully!" });
            }
            setForm({ category_id: "", amount: "", month: "", year: "" });
            fetchBudgets();
        } catch (err) {
            console.error("Error saving budget:", err);
            setManageBudgetMessage({ type: "danger", text: "Failed to save budget. Pleaase check if all inputs are provided" });
        }
    };

    // Edit a Budget
    const handleEdit = (b) => {
        setForm({
            category_id: b.category?.id,
            amount: b.amount,
            month: b.month,
            year: b.year,
        });
        setEditId(b.id);
        setManageBudgetMessage({ type: "info", text: `Editing budget for ${b.category?.name}` });
    };

    // Delete a Budget
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await API.delete(`budgets/${id}/`);
            setManageBudgetMessage({ type: "success", text: "Budget deleted successfully!" });
            fetchBudgets();
        } catch (err) {
            console.error("Error deleting budget:", err);
            setManageBudgetMessage({ type: "danger", text: "Failed to delete budget." })
        }
    };

    return (
        <div className="analytics-container">
            <div className="card p-4 shadow-sm mb-5">

                <h4 className="centered-title">Manage Budgets</h4>


                {/* Form */}
                <form onSubmit={handleSubmit} className="row g-2 mb-4">
                    {ManageBudgetMessage.type && <div className={`alert alert-${ManageBudgetMessage.type}`}>{ManageBudgetMessage.text}</div>}

                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={form.category_id}
                            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Amount"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-2">

                        <select
                            className="form-select"
                            value={form.month || ""} // Ensure it properly checks and renders current state
                            onChange={(e) => setForm({ ...form, month: e.target.value })}
                        >
                            <option value="" disabled>Month</option> {/* Placeholder option */}
                            {[...Array(12)].map((_, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={form.year || ""} // Ensures proper selection behavior
                            onChange={(e) => setForm({ ...form, year: e.target.value })}
                        >
                            <option value="" disabled>Year</option> {/* Placeholder option */}
                            {[...Array(new Date().getFullYear() - 2000 + 1)].map((_, index) => {
                                const year = 2000 + index;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100">
                            {editId ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="card p-4 shadow-sm mb-5">
                <h4 className="centered-title">View budgets</h4>
                <div>
                    {ViewBudgetMessage.type && <div className={`alert alert-${ViewBudgetMessage.type}`} style={{ textAlign: 'center' }} >{ViewBudgetMessage.text}</div>}
                </div>

                <div className="row g-3 align-items-end mb-3">

                    <div className="col-md-3">
                        {/* <label className="form-label fw-bold">Category:</label> */}
                        <CategoryDropdown
                            categories={categories}
                            selectedCategories={selectedCategories}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={mode || ""}
                            onChange={(e) => setMode(e.target.value)}
                        >
                            <option value="" disabled>Mode</option> {/* Placeholder option */}
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    {mode === "monthly" && (
                        <div className="col-md-2">
                            <select className="form-select" onChange={(e) => setMonth(e.target.value)}>
                                <option value="" disabled>Month</option> {/* Placeholder option */}
                                {/* <option value="all">All</option> */}
                                {[...Array(12)].map((_, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {new Date(0, index).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="col-md-2">
                        {/* <label className="form-label fw-bold">Year:</label> */}
                        <select className="form-select" onChange={(e) => setYear(e.target.value)}>
                            <option value="" >Year</option> {/* Placeholder option */}
                            {[...Array(new Date().getFullYear() - 2000 + 1)].map((_, index) => {
                                const year = 2000 + index;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100" onClick={fetchFilteredBudget}>Apply Filters</button>

                    </div>
                </div>



                {/* Table */}
                <table className="table table-bordered table-striped">
                    <thead className="table-light">
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Month</th>
                            <th>Year</th>
                            <th style={{ width: "150px " }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finalFilteredBudgets.length > 0 ? (
                            finalFilteredBudgets.map((b) => (

                                <tr key={b.id}>
                                    <td>{b.category?.name}</td>
                                    <td>{b.amount}</td>
                                    <td>{getMonthName(b.month)}</td>
                                    <td>{b.year}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEdit(b)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(b.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">
                                    No budget found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}