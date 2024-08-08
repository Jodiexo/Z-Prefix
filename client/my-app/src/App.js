import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Register from './Register';
import ItemList from './ItemList';
import ItemDetail from './ItemDetail';
import AddItemForm from './AddItemForm';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <Router>
       <div className="App">
        <nav>
          <Link to="/items">View Items</Link>
          {isAuthenticated && <Link to="/add-item">Add Item</Link>}
          <div className='logout-button'>
          {isAuthenticated ? (
            <button onClick={logout}>Logout</button>
          ) : (
            
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/:id" element={<ItemDetail />} />
           <Route 
            path="/add-item" 
            element={isAuthenticated ? <AddItemForm /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to="/items" />} />
        </Routes>
      </div>
    </Router>
  );
}

const AuthenticatedApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AuthenticatedApp;