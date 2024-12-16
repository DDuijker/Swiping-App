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

/**
 * Handles API errors and returns user-friendly error messages.
 * @param {any} error - The error object from Axios.
 * @returns {string} - User-friendly error message.
 */
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;

    if (status === 400) return data.message || "Invalid request.";
    if (status === 401) return data.message || "Unauthorized. Please log in.";
    if (status === 404) return data.message || "Not found.";
    return data.message || `Unexpected error: ${status}.`;
  } else if (error.request) {
    return "Network error. Please check your connection.";
  } else {
    return error.message || "An unexpected error occurred.";
  }
};

/**
 * Logs in the user.
 * @async
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} - The logged-in user data.
 * @throws {Error} - If login fails.
 */
export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post("/login", { username, password });
    const { token, user } = response.data;

    // Store token and user data in AsyncStorage
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    const message = handleApiError(error);
    throw new Error(message);
  }
};

/**
 * Registers a new user.
 * @async
 * @param {string} username - The user's username.
 * @param {string} password - The user's password.
 * @param {string} email - The user's email address.
 * @param {string} avatar - The user's avatar as a base64 string.
 * @param {Array<Object>} favoriteMovieGenres - List of user's favorite movie genres.
 * @param {Array<Object>} favoriteTVGenres - List of user's favorite TV genres.
 * @returns {Promise<Object>} - The newly registered user's data.
 * @throws {Error} - If registration fails.
 */
export const register = async (
  username,
  password,
  email,
  avatar,
  favoriteMovieGenres,
  favoriteTVGenres
) => {
  try {
    let processedAvatar = avatar;
    if (avatar && avatar.length > 1000000) {
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

    const { user, token } = response.data;
    console.log(user);
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    return user, token;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Retrieves the logged-in user's data from local storage.
 * @async
 * @returns {Promise<Object|null>} - The logged-in user data or null if not logged in.
 * @throws {Error} - If retrieval fails.
 */
export const getUser = async () => {
  try {
    const userString = await AsyncStorage.getItem("user");
    if (!userString) return null;
    return JSON.parse(userString);
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Failed to retrieve user info.");
  }
};

/**
 * Checks if the user is authenticated.
 * @async
 * @returns {Promise<boolean>} - True if authenticated, false otherwise.
 * @throws {Error} - If authentication check fails.
 */
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token !== null;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Logs out the user by removing token and user data from local storage.
 * @async
 * @returns {Promise<void>}
 * @throws {Error} - If logout fails.
 */
export const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    console.log("Logged out successfully.");
  } catch (error) {
    console.error("Error during logout:", error.message);
    throw new Error("Failed to log out.");
  }
};

/**
 * Retrieves the user's ID from the backend.
 * @async
 * @returns {Promise<string>} - The user's ID.
 * @throws {Error} - If retrieval fails.
 */
export const getUserId = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    // console.log(token);
    if (!token) throw new Error("User is not authenticated.");

    const response = await axiosInstance.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data._id;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Updates the user's data.
 * @async
 * @param {string} id - The user's ID.
 * @param {Object} data - The updated user data.
 * @returns {Promise<Object>} - The updated user data.
 * @throws {Error} - If update fails.
 */
export const updateUser = async (id, data) => {
  try {
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    if (!token) throw new Error("User is not authenticated.");

    const response = await axiosInstance.put(`/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Searches for users by username.
 * @async
 * @param {string} username - The username to search for (optional).
 * @returns {Promise<Array<Object>>} - List of users with matching usernames.
 * @throws {Error} - If the search fails.
 */
export const searchUsers = async (username) => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await axiosInstance.get("/search", {
      params: { username },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Retrieves all users.
 * @async
 * @returns {Promise<Array<Object>>} - List of all users.
 * @throws {Error} - If retrieval fails.
 */
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Retrieves a specific user by ID.
 * @async
 * @param {string} id - The user's ID.
 * @returns {Promise<Object>} - The user's data.
 * @throws {Error} - If retrieval fails.
 */
export const getUserById = async (id) => {
  try {
    const token = await AsyncStorage.getItem("token");
    // if (!token) throw new Error("User is not authenticated.");

    const response = await axiosInstance.get(`/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Deletes the user's account.
 * @async
 * @param {string} id - The user's ID.
 * @returns {Promise<void>}
 * @throws {Error} - If deletion fails.
 */
export const deleteUser = async (id) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("User is not authenticated.");

    await axiosInstance.delete(`/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
/**
 * Changes the user's password.
 * @async
 * @param {string} userId - The user's ID.
 * @param {string} currentPassword - The user's current password.
 * @param {string} newPassword - The user's new password.
 * @returns {Promise<void>}
 * @throws {Error} - If password change fails.
 */
export const changePassword = async (userId, password, newPassword) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("User is not authenticated.");

    // Verify current password
    const verifyResponse = await axiosInstance.post(
      "/verify-password",
      {
        userId,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (verifyResponse.status !== 200) {
      throw new Error("Incorrect password.");
    }
    // Update password
    const data = { newPassword };
    await updateUser(userId, data);
  } catch (error) {
    console.error("Error changing password:", error.message);
    throw new Error(handleApiError(error));
  }
};
