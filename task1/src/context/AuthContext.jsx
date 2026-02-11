// Task 1: Simplified AuthContext for local-only authentication (no backend)
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Load user from localStorage if available
        const saved = localStorage.getItem('task1_user');
        return saved ? JSON.parse(saved) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    useEffect(() => {
        if (user) {
            localStorage.setItem('task1_user', JSON.stringify(user));
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem('task1_user');
            setIsAuthenticated(false);
        }
    }, [user]);

    // Simple mock login for Task 1.
    // NOTE: In a real production app, this would make an API call to the backend.
    // For Task 1 (SPA focus), we simulate a network request.
    const login = async (username, password) => {
        // Mock authentication - accept any credentials for demo purposes
        // In a real app, this would validate against a backend
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockUser = {
                    username: username,
                    role: username === 'admin' ? 'admin' : 'user'
                };
                setUser(mockUser);
                setIsAuthenticated(true);
                resolve({ success: true });
            }, 300); // Simulate network delay
        });
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('task1_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
