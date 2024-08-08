import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Make sure to import useAuth

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth(); // Get authentication status

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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Item List</h1>
            {items.map(item => (
                <div key={item.id}>
                    <h2>{item.name}</h2>
                    <p>{item.description}</p>
                    <p>Quantity: {item.quantity}</p>
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