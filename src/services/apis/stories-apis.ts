import axios from 'axios';

import { axiosInstance, waitForNonce } from './admin-apis';
import {
  storySchema,
  CreateStorySchema,
} from 'src/services/models/battleHIVE.types';

// Declare the WordPress API settings type
declare global {
  interface Window {
    wpApiSettings?: {
      nonce: string;
    };
  }
}

export interface StoryData {
  // User-editable fields
  title: string;
  story: string;
  author: string;
  isContentSensitive?: boolean;
  isShared: boolean;

  // System-controlled fields (protected from user modification)
  system: {
    HIVE: string;
    prompts: string[];
    contentWarnings: string[] | ['None'];
    battleName: string;
    wordCount: number;
    characterCount: number;
    status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
    feedback: {
      id: string;
      feedback: string;
      isPublic: boolean;
      isPositive: boolean;
      isAnonymous: boolean;
    }[];
    wins: number;
    losses: number;
    lastModified: string;
    modifiedBy: 'system' | 'admin';
    version: number;
    tags: string[];
    metadata: {
      isUserEditable: boolean;
      lastAdminUpdate: string | null;
      adminId: string | null;
    };
  };
}

// Function to add a story to the database
export const addStory = async (
  story: CreateStorySchema
): Promise<storySchema> => {
  try {
    await waitForNonce();
    console.log('Attempting to add new story:', {
      title: story.title,
      HIVE: story.system.HIVE,
      wordCount: story.system.wordCount,
      characterCount: story.system.characterCount,
      status: story.system.status,
      prompts: story.system.prompts,
      contentWarnings: story.system.contentWarnings,
      isContentSensitive: story.isContentSensitive,
    });

    const response = await axiosInstance.post('/stories', story);
    console.log('Story added successfully:', {
      id: response.data.id,
      title: response.data.title,
      HIVE: response.data.system.HIVE,
      status: response.data.system.status,
      wordCount: response.data.system.wordCount,
      characterCount: response.data.system.characterCount,
      feedback: response.data.system.feedback,
      wins: response.data.system.wins,
      losses: response.data.system.losses,
      isShared: response.data.isShared,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding story:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw new Error('Failed to add story. Please try again.');
  }
};

// Function to update existing story
export const updateStory = async (story: storySchema): Promise<storySchema> => {
  try {
    await waitForNonce();
    console.log('Attempting to update story:', {
      id: story.id,
      title: story.title,
      HIVE: story.system.HIVE,
      wordCount: story.system.wordCount,
      characterCount: story.system.characterCount,
      status: story.system.status,
      prompts: story.system.prompts,
      contentWarnings: story.system.contentWarnings,
      isContentSensitive: story.isContentSensitive,
    });

    const response = await axiosInstance.put(`/stories/${story.id}`, story);
    console.log('Story updated successfully:', {
      id: response.data.id,
      title: response.data.title,
      HIVE: response.data.system.HIVE,
      status: response.data.system.status,
      wordCount: response.data.system.wordCount,
      characterCount: response.data.system.characterCount,
      feedback: response.data.system.feedback,
      wins: response.data.system.wins,
      losses: response.data.system.losses,
      isShared: response.data.isShared,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating story:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw new Error('Failed to update story. Please try again.');
  }
};

// Function to get story by ID
export const getStory = async (id: string): Promise<storySchema> => {
  try {
    await waitForNonce();
    console.log('Attempting to fetch story with ID:', id);

    const response = await axiosInstance.get(`/stories/${id}`);
    console.log('Story fetched successfully:', {
      id: response.data.id,
      title: response.data.title,
      HIVE: response.data.system.HIVE,
      status: response.data.system.status,
      wordCount: response.data.system.wordCount,
      characterCount: response.data.system.characterCount,
      feedback: response.data.system.feedback,
      wins: response.data.system.wins,
      losses: response.data.system.losses,
      isShared: response.data.isShared,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching story:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw new Error('Failed to fetch story. Please try again.');
  }
};
