import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './ItemList.css';

const EditItemForm = ({ item, onSave, onCancel }) => {
    const [name, setName] = useState(item.name);
    const [description, setDescription] = useState(item.description);
    const [quantity, setQuantity] = useState(item.quantity);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, description, quantity });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
            />
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const fetchItems = async (page) => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const url = isAuthenticated
                ? `http://localhost:3000/api/items`
                : `http://localhost:3000/api/items/public`;
            const response = await axios.get(`${url}?page=${page}&limit=10`, {
                headers: isAuthenticated ? { 'x-auth-token': token } : {}
            });
            setItems(response.data.items);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            setError('Failed to fetch items. Please try again later.');
            console.error('Error fetching items:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchItems(currentPage);
    }, [currentPage, isAuthenticated]);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleSave = async (id, updatedItem) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/api/items/${id}`, updatedItem, {
                headers: { 'x-auth-token': token }
            });
            setEditingId(null);
            fetchItems(currentPage);
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/api/items/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchItems(currentPage);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleViewDetails = (id) => {
        navigate(`/items/${id}`);
    };

    const truncateDescription = (description) => {
        return description.length > 100 ? description.substring(0, 100) + '...' : description;
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Item List</h1>
            {items.map(item => (
                <div key={item.id}>
                    {editingId === item.id ? (
                        <EditItemForm
                            item={item}
                            onSave={(updatedItem) => handleSave(item.id, updatedItem)}
                            onCancel={() => setEditingId(null)}
                        />
                    ) : (
                        <>
                            <h2>{item.name}</h2>
                            <p>{truncateDescription(item.description)}</p>
                            <p>Quantity: {item.quantity}</p>
                            <button onClick={() => handleViewDetails(item.id)}>View Details</button>
                            {isAuthenticated && (
                                <>
                                    <button onClick={() => handleEdit(item.id)}>Edit</button>
                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                </>
                            )}
                        </>
                    )}
                </div>
            ))}
            <div>
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default ItemList;