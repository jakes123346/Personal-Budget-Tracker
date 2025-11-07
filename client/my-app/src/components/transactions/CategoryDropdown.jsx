import React, { useState } from 'react';
import { Dropdown, Form } from 'react-bootstrap';
import '../../styles/dropdown.css'; // Ensure this matches the path where dropdown.css resides


const CategoryDropdown = ({ categories, selectedCategories, onCategoryChange }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const handleToggle = (isOpen) => {
        setShowDropdown(isOpen);
    };
    const handleSelect = (category) => {
        if (category === "all") {
            onCategoryChange(selectedCategories.includes("all") ? [] : ["all"]);
        } else {
            const updated = selectedCategories.includes(category)
                ? selectedCategories.filter(cat => cat !== category)
                : [...selectedCategories.filter(cat => cat !== "all"), category];
            onCategoryChange(updated);
        }
    };
    return (
        <Dropdown show={showDropdown} onToggle={handleToggle}>
            <Dropdown.Toggle class="btn btn-light"  style={{ width: '100%' ,backgroundColor:'white',borderColor: '#ccc',color:'black'}}>
                Select Categories
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto', minWidth: '200px', backgroundColor: 'white' }}>
                <Form.Check
                    type="checkbox"
                    label="All Categories"
                    checked={selectedCategories.includes("all")}
                    onChange={() => handleSelect("all")}
                    className="dropdown-item"
                />
                <Dropdown.Divider />
                {categories.map((cat) => (
                    <Form.Check
                        key={cat.id}
                        type="checkbox"
                        label={cat.name}
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => handleSelect(cat.name)}
                        className="dropdown-item"
                    />
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};
export default CategoryDropdown;