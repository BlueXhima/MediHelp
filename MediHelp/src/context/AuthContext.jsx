import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authOpen, setAuthOpen] = useState(false);
    const [user, setUser] = useState(null);

    // Restore user from localStorage on app load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Save user to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const openAuth = () => setAuthOpen(true);
    const closeAuth = () => setAuthOpen(false);
    const logout = () => {
        setUser(null);
        setAuthOpen(false);
    };

    return (
        <AuthContext.Provider value={{ authOpen, openAuth, closeAuth, user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}