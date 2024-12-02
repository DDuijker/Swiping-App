import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `http://${process.env.EXPO_PUBLIC_API_URL}/api/user`;

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
  avatar,
  favoriteMovieGenres,
  favoriteTVGenres
) => {
  try {
    // Compress the image before sending
    let processedAvatar = avatar;
    if (avatar && avatar.length > 1000000) {
      // If larger than ~1MB
      const compressionRatio = 1000000 / avatar.length;
      // const quality = Math.min(0.95, Math.max(0.1, compressionRatio));
      // Remove the data:image prefix if present
      processedAvatar = avatar.includes("base64,")
        ? avatar.split("base64,")[1]
        : avatar;
    }

    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        email,
        avatar: processedAvatar,
        favoriteMovieGenres: favoriteMovieGenres,
        favoriteTVGenres: favoriteTVGenres,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Registration failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
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
