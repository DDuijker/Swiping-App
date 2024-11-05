import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:27017/api/user"; // Adjust URL as needed

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
            console.log(data.user)
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
export const register = async (username, password, email, avatar = "", favoriteGenres = []) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, email, avatar, favoriteGenres })
        });
        
        const data = await response.json();

        if (response.ok) {
            // Store token and user info in AsyncStorage
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));

            console.log("User registered successfully:", data.user);
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

// Function to logout
export const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
};