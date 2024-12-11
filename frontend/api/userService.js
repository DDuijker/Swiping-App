import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}/api/user`;

// Axios instance with default settings
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to login user
export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post("/login", {
      username,
      password,
    });

    const { token, user } = response.data;

    // Store token, user info, and user ID in AsyncStorage
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.msg || "Login failed. Please try again."
    );
  }
};

// Function to register a user
export const register = async (
  username,
  password,
  email,
  avatar,
  favoriteMovieGenres,
  favoriteTVGenres
) => {
  try {
    // Compress the image before sending
    let processedAvatar = avatar;
    if (avatar && avatar.length > 1000000) {
      // Remove the data:image prefix if present
      processedAvatar = avatar.includes("base64,")
        ? avatar.split("base64,")[1]
        : avatar;
    }

    const response = await axiosInstance.post("/register", {
      username,
      password,
      email,
      avatar: processedAvatar,
      favoriteMovieGenres,
      favoriteTVGenres,
    });

    const { user } = response.data;

    // Store user ID in AsyncStorage
    await AsyncStorage.setItem("userId", user._id); // Assuming user object contains _id

    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.msg ||
        `Registration failed. Status: ${error.response?.status}`
    );
  }
};

// Function to get logged-in user info
export const getUser = async () => {
  try {
    const userString = await AsyncStorage.getItem("user");
    if (!userString) return null;
    return JSON.parse(userString);
  } catch (error) {
    console.log("Error getting user:", error);
    return null;
  }
};

// Function to check authentication status
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token !== null; // Return true if a token exists, otherwise false
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

// Function to logout
export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("userId");
    console.log("Logged out successfully.");
  } catch (error) {
    console.error("Error during logout:", error.message);
  }
};

// Function to get the user ID from mongoose
export const getUserId = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log("Authorization Token:", token); // Log the token for debugging
    if (!token) throw new Error("User is not authenticated.");

    const response = await axiosInstance.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`, // Send token for authentication
      },
    });

    return response.data._id;
  } catch (error) {
    console.error("Error fetching user ID:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.msg || "Unable to fetch user ID. Please try again."
    );
  }
};
