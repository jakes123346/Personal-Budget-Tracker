import { useState, useEffect } from "react";
import API from "../transactions/api";
import { Button } from "bootstrap/dist/js/bootstrap.bundle.min";

export default function BudgetUI() {

    const [budgets, setBudgets] = useState([]);
    const [categoreis, setCategories] = useState([]);
    const [form, setForm] = useState({
        category_id: "",
        amount: "",
        month: "",
        year: "",
    });

    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState({ type: "", text: ""});

    // Fetch Budgets
    const fetchBudgets = async () => {
        try {
            const res = await API.get("budgets/")
            setBudgets(res.data)
        } catch (err) {
            console.error("Error fetching budgets:", err);
            setMessage({ type: "danger", text: "Failed to fetch budgets."});
        }
    };

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const res = await API.get("categories/");
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setMessage({ type: "danger", text: "Failed to fetch categories."});
        }
    };

    useEffect( () => {
        fetchBudgets();
        fetchCategories();
    },[]);


    // Add or Update Budget
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await API.put(`budgets/${editId}/`, form);
                setMessage({ type: "success", text: "Budget updated successfully!"});
                setEditId(null);
            } else { 
                await API.post("budgets/", form);
                setMessage({ type: "success", text: "Budget added successfully!"});
            }
            setForm({ category_id: "", amount: "", month: "", year: ""});
            fetchBudgets();
            } catch (err) {
                console.error("Error saving budget:",err);
                setMessage({ type: "danger", text: "Failed to save budget."});
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
        setMessage({type: "info", text: `Editing budget for ${b.category?.name}`});
    };

    // Delete a Budget
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await API.delete(`budgets/${id}/`);
            setMessage({ type: "success", text: "Budget deleted successfully!"});
            fetchBudgets();
        } catch (err) {
            console.error("Error deleting budget:",err);
            setMessage({ type: "danger", text: "Failed to delete budget."})
        }
    };

    return(
        <div className="container mt-4">
            <h3>Manage Budgets</h3> 

            {/* Form */}
            <form onSubmit={handleSubmit} className="row g-2 mb-4">
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={form.category_id}
                        onChange={(e) => setForm({ ...form, category_id: e.target.value})}
                        required 
                    >
                        <option value="">Select Category</option>
                        {categoreis.map((cat) => (
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
                        onChange={(e) => setForm({...form, amount: e.target.value})}
                        required 
                    />
                </div>
                <div className="col-md-2">
                    <input 
                        type="number"
                        className="form-control"
                        placeholder="Month(1-12)"
                        value={form.month}
                        onChange={(e) => setForm({... form, month: e.target.value})}
                        required
                    />
                </div>
                <div className="col-md-2">
                    <input 
                        type="number"
                        className="form-control"
                        placeholder="Year"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value})}
                        required
                    />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary w-100">
                        {editId ? "Update" : "Add"}
                    </button>
                </div>
            </form>

            {/* Table */}
            <table className="table table-bordered table-striped">
                <thead className="table-light">
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Month</th>
                        <th>Year</th>
                        <th style={{ width: "150px "}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {budgets.length > 0 ? (
                        budgets.map((b) => (
                            <tr key={b.id}>
                                <td>{b.category?.name}</td>
                                <td>{b.amount}</td>
                                <td>{b.month}</td>
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
                    ) :  (
                        <tr>
                            <td colSpan="5" className="text-center text-muted">
                                No budget found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}