import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = api.getToken();
        if (!token) {
            setLoading(false);
            return;
        }
        api.me(token)
            .then(setUser)
            .catch(() => api.clearToken())
            .finally(() => setLoading(false));
    }, []);

    const login = async (email, password) => {
        const data = await api.login(email, password);
        api.setToken(data.access_token);
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        api.clearToken();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);