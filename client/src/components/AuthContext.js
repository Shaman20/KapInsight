import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [token, setToken] = useState(null);
    const [firstName,setfirstName]=useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedFirstName = localStorage.getItem('firstName');

        if (savedToken) {
            setToken(savedToken);
            setToken(savedFirstName);
        }
    }, []);

    const login = (jwtToken,firstName) => {
        setToken(jwtToken);
        setfirstName(firstName);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('firstName', firstName);
        navigate('/dashboard');
    };

    const logout = () => {
        setToken(null);
        setfirstName(null)
        localStorage.removeItem('token');
        localStorage.removeItem('firstName');
        navigate('/');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout ,firstName}}>
            {children}
        </AuthContext.Provider>
    );
}
