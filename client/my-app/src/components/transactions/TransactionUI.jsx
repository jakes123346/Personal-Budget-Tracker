import { useState, useEffect } from "react";
import API from "../transactions/api";
import axios from "axios";

export default function TransactionUI(){

    const [transactions, setTransaction] = useState([]);
    const [categoreis, setCategories] = useState([]);
    const [form, setForm] = useState({
        type: "",
        category_id: "",
        amount: "",
        date: "",
    });

    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState({ type: "", text: ""});

    // Fetch Transactions
    const fetchTransactions = async () => {
        try {
            const res = await API.get("transactions/");
            setTransaction(res.data);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setMessage({ type: "danger", text: "Failed to fetch transactions."});
        }
    };

    // Fetch Categories
    const fetchCategories = async () => {
        try {
            const res = await API.get("categories/");
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories:",err);
            setMessage({ type: "danger", text: "Failed to load categories."});
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    },[]);

    // Add or Update Transaction
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(editId)
        try {
                if (editId){
                await API.put(`transactions/${editId}/`, form);
                setMessage({ type: "success", text: "Transaction updated successfully!"});
                setEditId(null);
                }else{
                console.log("-------before post-------------")
                console.log(JSON.stringify(form))
                // await API.post("transactions/", JSON.stringify(form));
                await API.post("transactions/", {
                    type: form.type, 
                    category_id: form.category_id, 
                    amount: parseFloat(form.amount), 
                    date:form.date});
                console.log("----------- after post------------")
                console.log("Submitting form:",form)
                setMessage({ type: "success", text: 'Transaction added successfully!'});
                }
                setForm({type: "", category_id: "", amount: "", date: ""});
                // fetchTransactions();
        } catch (err) {
            console.error("Error saving transaction:",err);
            setMessage({ type: "danger", text: "Failed to save transaction."})
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
        setMessage({ type: "info", text: `Editing transaction for ${t.category?.name}`});
    };

    // Delete Transaction 
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            await API.delete(`transactions/${id}/`);
            setMessage({ type: "success", text: "Transaction deleted successfully!"});
            fetchTransactions();
        } catch (err) {
            console.error("Error deleting transaction:", err);
            setMessage({ type: "danger", text: "Failed to delete transaction."})
        }
    };

    return (
        <div className="container mt-4">
            <h3>Manage Transactions</h3>

            {/* Form */}
            <form onSubmit={handleSubmit} className="row g-2 mb-4">
                <div className="col-md-2">
                    <select
                        className="form-select"
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value})}
                        required
                    >
                        <option value="">Type</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={form.category_id}
                        onChange={(e) => setForm({ ...form, category_id: e.target.value})}
                        required
                    >
                        <option value="">Category</option>
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
                            onChange={(e) => setForm({ ...form, amount: e.target.value})}
                            required 
                        />
                </div>
                <div className="col-md-3">
                    <input 
                        type="date"
                        className="form-control"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value})}
                        required 
                    />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary w-100" onClick={handleSubmit}>
                        {editId ? "Update" : "Add"}
                    </button>
                </div>
            </form>
            
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
                    {transactions.length > 0 ?(
                        transactions.map((t) =>(
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
    );
}