import axios from 'axios';

import { axiosInstance, waitForNonce } from './admin-apis';
import { storySchema } from 'src/services/models/battleHIVE.types';

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
  story: Omit<
    storySchema,
    'id' | 'system.feedback' | 'system.wins' | 'system.losses'
  >
): Promise<storySchema> => {
  try {
    await waitForNonce();
    console.log('Attempting to add story:', {
      title: story.title,
      HIVE: story.system.HIVE,
      wordCount: story.system.wordCount,
      characterCount: story.system.characterCount,
      status: story.system.status,
      prompts: story.system.prompts,
      contentWarnings: story.system.contentWarnings,
      isContentSensitive: story.isContentSensitive,
      lastModified: story.system.lastModified,
      modifiedBy: story.system.modifiedBy,
      version: story.system.version,
      tags: story.system.tags,
      metadata: story.system.metadata,
    });

    const response = await axiosInstance.post('/stories', {
      title: story.title,
      story: story.story,
      author: story.author,
      isContentSensitive: story.isContentSensitive,
      isShared: story.isShared,
      system: {
        HIVE: story.system.HIVE,
        prompts: story.system.prompts,
        contentWarnings: story.system.contentWarnings,
        battleName: story.system.battleName,
        wordCount: story.system.wordCount,
        characterCount: story.system.characterCount,
        status: story.system.status,
        lastModified: story.system.lastModified,
        modifiedBy: story.system.modifiedBy,
        version: story.system.version,
        tags: story.system.tags,
        metadata: story.system.metadata,
      },
    });

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
      lastModified: response.data.system.lastModified,
      modifiedBy: response.data.system.modifiedBy,
      version: response.data.system.version,
      tags: response.data.system.tags,
      metadata: response.data.system.metadata,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding story:', error);
    throw error;
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
      lastModified: story.system.lastModified,
      modifiedBy: story.system.modifiedBy,
      version: story.system.version,
      tags: story.system.tags,
      metadata: story.system.metadata,
    });

    const response = await axiosInstance.put(`/stories/${story.id}`, {
      title: story.title,
      story: story.story,
      author: story.author,
      isContentSensitive: story.isContentSensitive,
      isShared: story.isShared,
      system: {
        HIVE: story.system.HIVE,
        prompts: story.system.prompts,
        contentWarnings: story.system.contentWarnings,
        battleName: story.system.battleName,
        wordCount: story.system.wordCount,
        characterCount: story.system.characterCount,
        status: story.system.status,
        lastModified: story.system.lastModified,
        modifiedBy: story.system.modifiedBy,
        version: story.system.version,
        tags: story.system.tags,
        metadata: story.system.metadata,
      },
    });

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
      lastModified: response.data.system.lastModified,
      modifiedBy: response.data.system.modifiedBy,
      version: response.data.system.version,
      tags: response.data.system.tags,
      metadata: response.data.system.metadata,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating story:', error);
    throw error;
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
