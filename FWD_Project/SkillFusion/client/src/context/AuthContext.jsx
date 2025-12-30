import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

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
            const res = await fetch('http://localhost:5000/auth/login', {
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
            const res = await fetch('http://localhost:5000/auth/register', {
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
        // Also update local storage if it was used there to prevent mismatch? 
        // No, we are moving entirely to sessionStorage.
    };

    const checkUsernameAvailability = async (username) => {
        try {
            const res = await fetch('http://localhost:5000/auth/check-username', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            const data = await res.json();
            return data.available;
        } catch (error) {
            console.error("Username check error", error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, updateUser, checkUsernameAvailability }}>
            {children}
        </AuthContext.Provider>
    );
};
