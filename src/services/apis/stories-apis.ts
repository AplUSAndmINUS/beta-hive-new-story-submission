import { axiosInstance } from "./admin-apis";

// Function to add a story to the database
export const addStory = async (story: any) => {
  try {
    const response = await axiosInstance.post("/stories", story);
    return response.data;
  } catch (error) {
    console.error("Error adding story:", error);
    return null;
  }
};

// Function to update existing story
export const updateStory = async (story: any) => {
  try {
    const response = await axiosInstance.put(`/stories/${story.id}`, story);
    return response.data;
  } catch (error) {
    console.error("Error updating story:", error);
    return null;
  }
};

// Function to get story by ID
export const getStory = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/stories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching story:", error);
    return null;
  }
};