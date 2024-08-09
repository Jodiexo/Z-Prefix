import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddItemForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3000/api/items', 
                { name, description, quantity: parseInt(quantity) },
                { headers: { 'x-auth-token': token } }
            );
            navigate('/items'); // Redirect to items list after successful addition
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error || 'Failed to add item. Please try again.');
            } else {
                setError('Failed to add item. Please try again.');
                   }
        console.error('Error adding item:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Item</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="quantity">Quantity:</label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Item</button>
        </form>
    );
};

export default AddItemForm;