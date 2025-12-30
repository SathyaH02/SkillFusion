import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Ensure no trailing slash
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = sessionStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Error parsing stored user:", error);
            return null;
        }
    });

    const login = async (username, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                return true;
            } else {
                console.error(data.message);
                return false;
            }
        } catch (error) {
            console.error("Login error", error);
            return false;
        }
    };

    const signup = async (userData) => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                return true;
            } else {
                console.error(data.message);
                return false;
            }
        } catch (error) {
            console.error("Signup error", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem('user');
    };

    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        sessionStorage.setItem('user', JSON.stringify(updatedUserData));
    };

    const checkUsernameAvailability = async (username) => {
        try {
            const res = await fetch(`${API_URL}/auth/check-username`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });

            if (!res.ok) {
                // Try to parse error message, fallback to status text
                let errorMessage = `Server Error: ${res.status}`;
                try {
                    const errorData = await res.json();
                    if (errorData.message) errorMessage = errorData.message;
                } catch (e) { /* ignore json parse error */ }

                return { available: false, error: errorMessage };
            }

            const data = await res.json();
            return { available: data.available, error: null };
        } catch (error) {
            console.error("Username check error", error);
            return { available: false, error: "Network Error: Could not connect to server." };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, checkUsernameAvailability }}>
            {children}
        </AuthContext.Provider>
    );
};
