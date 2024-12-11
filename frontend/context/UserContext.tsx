import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login as userServiceLogin,
  logout as userServiceLogout,
  getUser,
  isAuthenticated,
} from "../api/userService";

/**
 * User context default values.
 * @typedef {Object} UserContextValue
 * @property {Object|null} user - Current user object or null if not logged in.
 * @property {boolean} loading - Whether the authentication check is in progress.
 * @property {(username: string, password: string) => Promise<void>} login - Function to log in the user.
 * @property {() => Promise<void>} logout - Function to log out the user.
 */

/** @type {UserContextValue} */
const defaultContextValue = {
  user: null,
  loading: false,
  login: async (username, password) => {},
  logout: async () => {},
};

const UserContext = createContext(defaultContextValue);

/**
 * Props for the `UserProvider` component.
 * @typedef {Object} UserProviderProps
 * @property {ReactNode} children - Child components to render inside the provider.
 */

/**
 * UserProvider component to manage user authentication and provide context.
 * @param {UserProviderProps} props - Component props.
 * @returns {JSX.Element} The UserProvider component.
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize authentication on component mount.
   * Checks if the user is authenticated and sets the current user state.
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          const userData = await getUser();
          setUser(userData);
        }
      } catch (error) {
        console.error(
          "Error during authentication initialization:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Log in a user and update the context.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @throws {Error} If the login fails.
   */
  const login = async (username, password) => {
    try {
      const userData = await userServiceLogin(username, password);
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error; // Re-throw to handle in the calling component
    }
  };

  /**
   * Log out the current user and reset the context.
   */
  const logout = async () => {
    try {
      await userServiceLogout();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Hook to access the UserContext.
 * @returns {UserContextValue} The context value.
 */
export const useUser = () => useContext(UserContext);
