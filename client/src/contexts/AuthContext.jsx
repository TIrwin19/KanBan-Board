import React, { createContext, useState, useContext } from 'react';

// Create the AuthContext
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

// Create a Provider component
export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null); // State for accessToken

    const value = {
        accessToken,
        setAccessToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

