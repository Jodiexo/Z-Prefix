import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Register from './Register';
import ItemList from './ItemList';

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
          {isAuthenticated ? (
            <>
              <Link to="/items">View Items</Link>
              <Link to="/manage-items">Manage Items</Link>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>

        <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/items" /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/items" /> : <Register />} />
          <Route 
            path="/items" 
            element={isAuthenticated ? <ItemList /> : <Navigate to="/login" />} 
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