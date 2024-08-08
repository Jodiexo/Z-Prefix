import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ItemDetail = () => {
    const [item, setItem] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        fetchItem();
    }, [id]);

    const fetchItem = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/items/public/${id}`);
            setItem(response.data);
        } catch (error) {
            console.error('Error fetching item:', error);
        }
    };

    if (!item) return <div>Loading...</div>;

    return (
        <div>
            <h1>{item.name}</h1>
            <p>{item.description}</p>
            <p>Quantity: {item.quantity}</p>
        </div>
    );
};

export default ItemDetail;