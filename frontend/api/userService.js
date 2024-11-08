import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.1.100:27017/api/user";

// Function to login user
export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
      // Store token and user info in AsyncStorage
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      console.log(data.user);
      return data.user;
    } else {
      throw new Error(data.msg || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Function to register a user
export const register = async (
  username,
  password,
  email,
  avatar = "",
  favoriteMovieGenres = [],
  favoriteTVGenres = []
) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        email,
        avatar,
        favoriteMovieGenres,
        favoriteTVGenres,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user info in AsyncStorage
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      console.log("User registered successfully:", data);
      return data.user;
    } else {
      throw new Error(data.msg || "Registration failed");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Function to get logged-in user info
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return JSON.parse(user);
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

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
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
  console.log("logged out");
};
