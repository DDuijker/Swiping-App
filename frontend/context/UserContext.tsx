// context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login as userServiceLogin,
  logout as userServiceLogout,
  getUser,
  isAuthenticated,
} from "../api/userService";

// Define a default context value
const defaultContextValue = {
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
};

interface UserProviderProps {
  children: ReactNode; // Explicitly define the type of children
}

const UserContext = createContext(defaultContextValue);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state for checking authentication

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const userData = await getUser();
        setUser(userData);
      }
      setLoading(false); // Set loading to false after checking authentication
    };

    initializeAuth();
  }, []);

  // Function to handle login
  const login = async (username, password) => {
    const userData = await userServiceLogin(username, password);
    setUser(userData);
  };

  // Function to handle logout
  const logout = async () => {
    await userServiceLogout();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
