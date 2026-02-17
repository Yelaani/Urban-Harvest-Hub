import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false); // Initial loading state could be true if checking token validity

    useEffect(() => {
        if (token) {
            // Decode user from token or similar if needed. 
            // For now, we trust the local storage token or could verify it with an API call.
            // We will just set a flag or keep the token.
            // Ideally calls: api.get('/auth/me')...
        }
    }, [token]);

    const login = async (username, password) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            return { success: true, user: userData };
        } catch (error) {
            console.error('Login failed:', error);
            const message = error.response?.data?.message || 'Login failed';
            const detail = error.response?.data?.error ? ` - ${error.response.data.error}` : '';
            return {
                success: false,
                message: message + detail
            };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/register', userData);
            return { success: true, message: response.data.message };
        } catch (error) {
            console.error('Registration failed:', error);
            const message = error.response?.data?.message || 'Registration failed';
            return {
                success: false,
                message: message
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
