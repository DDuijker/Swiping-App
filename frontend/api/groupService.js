import axios from "axios";

const API_BASE_URL = `http://${process.env.EXPO_PUBLIC_API_URL}/api/groups`;


const groupService = {
  // Fetch all groups
  getAllGroups: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data; // Return groups array
    } catch (error) {
      console.error("Error fetching groups:", error.message);
      throw error;
    }
  },

  // Create a new group
  createGroup: async (groupData) => {
    try {
      console.log("API_BASE_URL:", API_BASE_URL);
      const response = await axios.post(API_BASE_URL, groupData);
      return response.data; // Return created group
    } catch (error) {
      console.error("Error creating group:", error.message);
      throw error;
    }
  },
};

export default groupService;
