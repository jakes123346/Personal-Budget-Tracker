import { useState, useEffect } from "react";
import API from "../transactions/api";
import axios from "axios";
import "../../styles/dashboard.css";
import CategoryDropdown from "./CategoryDropdown";

export default function TransactionUI() {
    const [selectedCategories, setSelectedCategories] = useState("");
    const [mode, setMode] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const [transactions, setTransaction] = useState([]);
    const [finalFilteredTransactions, setFilteredTransactions] = useState([])
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        type: "",
        category_id: "",
        amount: "",
        date: "",
    });

    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [type, setType] = useState("");

    const fetchFilteredTransactions = async () => {
        await fetchTransactions()
        if (mode === "monthly" && !month) {
            alert("please select a month")
            return
        }
        if (mode === "yearly" && !year) {
            alert("Please select a year")
            return
        }

        let filteredTransactions = transactions
        console.log(type)
        if (type && type !== "all") {
            filteredTransactions = filteredTransactions.filter(transaction => transaction.type === type);
        }

        if (mode === 'yearly' && year) {
            filteredTransactions = filteredTransactions.filter(
                transaction => new Date(transaction.date).getFullYear() === parseInt(year)
            );
        }
        if (mode === 'monthly' && year && month) {
            filteredTransactions = filteredTransactions.filter(
                transaction => new Date(transaction.date).getFullYear() === parseInt(year)
                    && new Date(transaction.date).getMonth() + 1 === parseInt(month)
            );
        }
        // Filter by selected categories if not "all"
        if (selectedCategories && !selectedCategories.includes('all')) {
            filteredTransactions = filteredTransactions.filter(transaction =>
                selectedCategories.includes(transaction.category.name)
            );
        }
        filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        // return filteredTransactions;
        setFilteredTransactions(filteredTransactions)


    }

    const fetchTransactions = async () => {
        try {
            const res = await API.get("transactions/");
            setTransaction(res.data);
            console.log(transactions)
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setMessage({ type: "danger", text: "Failed to fetch transactions." });
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
        } catch (err) {
            console.error("Error fetching categories:", err);
            setMessage({ type: "danger", text: "Failed to load categories." });
        }
    };

    useEffect(() => {
        // fetchTransactions();
        fetchCategories();
    }, []);

    // Add or Update Transaction
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(editId)
        try {
            if (editId) {
                await API.put(`transactions/${editId}/`, form);
                setMessage({ type: "success", text: "Transaction updated successfully!" });
                setEditId(null);
            } else {
                console.log("-------before post-------------")
                console.log(JSON.stringify(form))
                // await API.post("transactions/", JSON.stringify(form));
                await API.post("transactions/", {
                    type: form.type,
                    category_id: form.category_id,
                    amount: parseFloat(form.amount),
                    date: form.date
                });
                console.log("----------- after post------------")
                console.log("Submitting form:", form)
                setMessage({ type: "success", text: 'Transaction added successfully!' });
            }
            setForm({ type: "", category_id: "", amount: "", date: "" });
            // fetchTransactions();
        } catch (err) {
            console.error("Error saving transaction:", err);
            setMessage({ type: "danger", text: "Failed to save transaction." })
        }
    };

    // Edit a Transaction
    const handleEdit = (t) => {
        setForm({
            type: t.type,
            category_id: t.category?.id,
            amount: t.amount,
            date: t.date,
        });
        setEditId(t.id)
        setMessage({ type: "info", text: `Editing transaction for ${t.category?.name}` });
    };

    // Delete Transaction 
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            await API.delete(`transactions/${id}/`);
            setMessage({ type: "success", text: "Transaction deleted successfully!" });
            fetchTransactions();
        } catch (err) {
            console.error("Error deleting transaction:", err);
            setMessage({ type: "danger", text: "Failed to delete transaction." })
        }
    };

    return (
        <div className="analytics-container">
            <div className="card p-4 shadow-sm mb-5">
                <h4 className="centered-title">Manage Transactions</h4>

                {/* Form */}
                <form onSubmit={handleSubmit} className="row g-2 mb-4">
                    <div className="col-md-2">
                        <select
                            className="form-select"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            required
                        >
                            <option value="" disabled>Type</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={form.category_id}
                            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                            required
                        >
                            <option value="">Category</option>
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
                    <div className="col-md-3">
                        <input
                            type="date"
                            className="form-control"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-primary w-100" onClick={handleSubmit}>
                            {editId ? "Update" : "Add"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="card p-4 shadow-sm mb-5">
                <h4 className="centered-title">View Transactions</h4>
                <div className="flex-row mb-3">
                    <div className="col-md-2">
                        {/* <label className="form-label fw-bold">Type:</label> */}
                        <select className="form-select" onChange={(e) => setType(e.target.value)}>
                            <option value=""disabled>Type</option>
                            <option value="all">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div className="col-md-2">
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
                        <button className="btn btn-primary w-100" onClick={fetchFilteredTransactions}>Apply Filters</button>
                    </div>
                </div>

                {/* Table */}
                <table className="table table-bordered table-striped">
                    <thead className="table-light">
                        <tr>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th style={{ width: "150px" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {finalFilteredTransactions.length > 0 ? (
                            finalFilteredTransactions.map((t) => (
                                <tr key={t.id}>
                                    <td>{t.type}</td>
                                    <td>{t.category?.name}</td>
                                    <td>{t.amount}</td>
                                    <td>{t.date}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => handleEdit(t)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">
                                    No transaction found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}