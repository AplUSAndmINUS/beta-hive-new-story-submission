import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  addStory,
  updateStory,
  getStory,
} from 'src/services/apis/stories-apis';
import { storySchema } from 'src/services/models/battleHIVE.types';

// Thunk for adding a new story
export const addStoryThunk = createAsyncThunk(
  'story/addStory',
  async (story: Omit<storySchema, 'id' | 'feedback' | 'wins' | 'losses'>) => {
    console.log('Starting addStoryThunk with data:', {
      title: story.title,
      HIVE: story.HIVE,
      wordCount: story.wordCount,
      characterCount: story.characterCount,
      status: story.status,
      prompts: story.prompts,
      contentWarnings: story.contentWarnings,
      isContentSensitive: story.isContentSensitive,
    });

    try {
      const response = await addStory(story);
      console.log('addStoryThunk completed successfully:', {
        id: response.id,
        title: response.title,
        HIVE: response.HIVE,
        status: response.status,
        wordCount: response.wordCount,
        characterCount: response.characterCount,
        feedback: response.feedback,
        wins: response.wins,
        losses: response.losses,
      });
      return response;
    } catch (error) {
      console.error('addStoryThunk failed:', error);
      throw error;
    }
  }
);

// Thunk for updating an existing story
export const updateStoryThunk = createAsyncThunk(
  'story/updateStory',
  async (story: storySchema) => {
    console.log('Starting updateStoryThunk with data:', {
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

    try {
      const response = await updateStory(story);
      console.log('updateStoryThunk completed successfully:', {
        id: response.id,
        title: response.title,
        HIVE: response.HIVE,
        status: response.status,
        wordCount: response.wordCount,
        characterCount: response.characterCount,
        feedback: response.feedback,
        wins: response.wins,
        losses: response.losses,
      });
      return response;
    } catch (error) {
      console.error('updateStoryThunk failed:', error);
      throw error;
    }
  }
);

// Thunk for getting a story by ID
export const getStoryThunk = createAsyncThunk(
  'story/getStory',
  async (id: string) => {
    console.log('Starting getStoryThunk for ID:', id);

    try {
      const response = await getStory(id);
      console.log('getStoryThunk completed successfully:', {
        id: response.id,
        title: response.title,
        HIVE: response.HIVE,
        status: response.status,
        wordCount: response.wordCount,
        characterCount: response.characterCount,
        feedback: response.feedback,
        wins: response.wins,
        losses: response.losses,
      });
      return response;
    } catch (error) {
      console.error('getStoryThunk failed:', error);
      throw error;
    }
  }
);
