import { useState, useEffect } from "react";
import API from "./api";


export default function CategoryUI() {

    const [categoreis, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState(null);
    const [message, setMessage] = useState({ type: "", text: ""});

    // Fetching all Catagories
    const fetchCategories = async () => {
        try{
                const res = await  API.get("categories/");
                setCategories(res.data);
        }
        catch (err) {
            console.error("Error fetching categories:",err);
            setMessage({type:"danger", text:"Failed to fetch categories."});
        }
    };

    // useEffect runs after the component first renders, [] means it runs only once, 
    // so wehen CategoryUI loads, it calls fetchCategories() to populate the table
    useEffect( () => {
        fetchCategories();
    },[]);

    
    // Add or Update category
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(editId) {
                await API.put(`categories/${editId}/`, {name});
                setMessage({type:"success", text: "Category updated successfully!"});
                setEditId(null);
            }else{
                await API.post("categories/",{name});
                setMessage({type:"success", text: "Category added successfully!"});
            }
            setName("");
            fetchCategories();
        }catch (err) {
            console.error("Error saving category:",err)
            setMessage({type: "danger", text: "Failed to save category."})
        }
    
    };

    // Edit a Category
    const handleEdit = (cat) => {
        setName(cat.name);
        setEditId(cat.id);
        setMessage({type: "info", text:`Editing category: ${cat.name}`});
    };

    //Delete a Category
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await API.delete(`categories/${id}/`);
            setMessage({type: "success", text: "Category deleted successfully!"});
            fetchCategories();
        }catch (err){
            console.error("Error deleting category:", err);
            setMessage({type: "danger", text: "Failed to delete category."})
        }
    };


    return (
        <div className="container mt-4">
            <h3>Manage Categories</h3>

            {/* Form */}
            <form onSubmit={handleSubmit} className="d-flex gap-2 mt-3 mb-4">
                <input 
                    className="form-control"
                    placeholder="Enter Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button className="btn btn-primary" onClick={handleSubmit}>
                    {editId ? "Update" : "Add"}
                </button>
            </form>

            {/* Table */}
            <table className="table table-bordered table-striped">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: "80px"}}>ID</th>
                        <th>Name</th>
                        <th style={{width: "160px"}}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categoreis.length > 0 ? (
                        categoreis.map((cat) => (
                            <tr key={cat.id}>
                                <td>{cat.id}</td>
                                <td>{cat.name}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(cat)}
                                    >
                                        Edit 
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(cat.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ): (
                        <tr>
                            <td colSpan="3" className="text-center text-muted">
                                No Categories found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}