import { axiosInstance } from './admin-apis';
import axios from 'axios';
import { storySchema } from 'src/services/models/battleHIVE.types';

export interface StoryData {
  title: string;
  story: string;
  author: string;
  HIVE: string;
  prompts: string[];
  isContentSensitive: boolean;
  contentWarnings: string[];
  battleName: string;
  wordCount: number;
  status: string;
}

// Function to add a story to the database
export const addStory = async (
  story: Omit<storySchema, 'id' | 'feedback' | 'wins' | 'losses'>
): Promise<storySchema> => {
  try {
    console.log('Attempting to add story:', {
      title: story.title,
      HIVE: story.HIVE,
      wordCount: story.wordCount,
      characterCount: story.characterCount,
      status: story.status,
      prompts: story.prompts,
      contentWarnings: story.contentWarnings,
      isContentSensitive: story.isContentSensitive,
    });

    const response = await axiosInstance.post('/stories', {
      title: story.title,
      story: story.story,
      author: story.author,
      HIVE: story.HIVE,
      prompts: story.prompts,
      isContentSensitive: story.isContentSensitive,
      contentWarnings: story.contentWarnings,
      battleName: story.battleName,
      wordCount: story.wordCount,
      characterCount: story.characterCount,
      status: story.status,
    });

    console.log('Story added successfully:', {
      id: response.data.id,
      title: response.data.title,
      HIVE: response.data.HIVE,
      status: response.data.status,
      wordCount: response.data.wordCount,
      characterCount: response.data.characterCount,
      feedback: response.data.feedback,
      wins: response.data.wins,
      losses: response.data.losses,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding story:', error);
    if (axios.isAxiosError(error)) {
      console.error('Request config:', error.config);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
    throw new Error('Failed to add story. Please try again.');
  }
};

// Function to update existing story
export const updateStory = async (story: storySchema): Promise<storySchema> => {
  try {
    console.log('Attempting to update story:', {
      id: story.id,
      title: story.title,
      HIVE: story.HIVE,
      wordCount: story.wordCount,
      characterCount: story.characterCount,
      status: story.status,
      prompts: story.prompts,
      contentWarnings: story.contentWarnings,
      isContentSensitive: story.isContentSensitive,
    });

    const response = await axiosInstance.put(`/stories/${story.id}`, {
      title: story.title,
      story: story.story,
      author: story.author,
      HIVE: story.HIVE,
      prompts: story.prompts,
      isContentSensitive: story.isContentSensitive,
      contentWarnings: story.contentWarnings,
      battleName: story.battleName,
      wordCount: story.wordCount,
      characterCount: story.characterCount,
      status: story.status,
    });

    console.log('Story updated successfully:', {
      id: response.data.id,
      title: response.data.title,
      HIVE: response.data.HIVE,
      status: response.data.status,
      wordCount: response.data.wordCount,
      characterCount: response.data.characterCount,
      feedback: response.data.feedback,
      wins: response.data.wins,
      losses: response.data.losses,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating story:', error);
    if (axios.isAxiosError(error)) {
      console.error('Request config:', error.config);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
    throw new Error('Failed to update story. Please try again.');
  }
};

// Function to get story by ID
export const getStory = async (id: string): Promise<storySchema> => {
  try {
    console.log('Attempting to fetch story with ID:', id);

    const response = await axiosInstance.get(`/stories/${id}`);
    console.log('Story fetched successfully:', {
      id: response.data.id,
      title: response.data.title,
      HIVE: response.data.HIVE,
      status: response.data.status,
      wordCount: response.data.wordCount,
      characterCount: response.data.characterCount,
      feedback: response.data.feedback,
      wins: response.data.wins,
      losses: response.data.losses,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching story:', error);
    if (axios.isAxiosError(error)) {
      console.error('Request config:', error.config);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
    }
    throw new Error('Failed to fetch story. Please try again.');
  }
};
