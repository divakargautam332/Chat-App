import { createContext, useState, useEffect } from "react";

// Create Auth Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);   // stores user info
    const [token, setToken] = useState(null); // stores auth token

    // Load user and token from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
            try {
                setUser(JSON.parse(savedUser));  // parse if user is an object
            } catch {
                setUser(savedUser); // fallback if user is string
            }
            setToken(savedToken);
        }
    }, []);

    // Login function
    const login = ({ token, user }) => {
        localStorage.setItem("token", token);
        // store user as string
        localStorage.setItem("user", JSON.stringify({
            id: user.id,
            username: user.username
        }));
        setToken(token);
        setUser(user);
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};