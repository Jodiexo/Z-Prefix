import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";


const Register = (onRegisterSuccess) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/register', { username, email, password });
            console.log('Registration response:', response.data);
            localStorage.setItem('token', response.data.token);
            login();
            navigate('/items');
            if (typeof onRegisterSuccess === 'function') {
                onRegisterSuccess();
            } else {
                navigate('/items');
            }
        } catch (error) {
             console.error('Registration error:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data.error : 'Registration failed. Try Again!')
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;