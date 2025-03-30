import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storySchema } from 'src/services/models/battleHIVE.types';

// Define the state interface based on story schema
interface StorySubmissionState {
  // Core story data
  title: string;
  story: string;
  author: string;
  HIVE: string;
  battleName: string;

  // Content and warnings
  isContentSensitive: boolean;
  contentWarnings: string[];

  // Story metadata
  prompts: string[];
  wordCount: number;
  characterCount: number;
  status: string;

  // UI state
  isBetaHIVEConfirmation: boolean;
  isStorySubmission: boolean;
}

const initialState: StorySubmissionState = {
  // Core story data
  title: '',
  story: '',
  author: '', // This should come from user authentication
  HIVE: '',
  battleName: 'Battle of the HIVEs', // This should come from admin settings

  // Content and warnings
  isContentSensitive: false,
  contentWarnings: [],

  // Story metadata
  prompts: [],
  wordCount: 0,
  characterCount: 0,
  status: 'draft',

  // UI state
  isBetaHIVEConfirmation: false,
  isStorySubmission: false,
};

const storySubmissionSlice = createSlice({
  name: 'storySubmissionReducer',
  initialState,
  reducers: {
    // Core story data actions
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setStory(state, action: PayloadAction<string>) {
      state.story = action.payload;
      // Update word and character counts when story changes
      state.characterCount = action.payload.length;
      state.wordCount = action.payload.trim().split(/\s+/).length;
    },
    setAuthor(state, action: PayloadAction<string>) {
      state.author = action.payload;
    },
    setHIVE(state, action: PayloadAction<string>) {
      state.HIVE = action.payload;
    },
    setBattleName(state, action: PayloadAction<string>) {
      state.battleName = action.payload;
    },

    // Content and warnings actions
    setContentSensitive(state, action: PayloadAction<boolean>) {
      state.isContentSensitive = action.payload;
      if (!action.payload) {
        state.contentWarnings = [];
      }
    },
    setContentWarnings(state, action: PayloadAction<string[]>) {
      state.contentWarnings = action.payload;
    },

    // Story metadata actions
    setPrompts(state, action: PayloadAction<string[]>) {
      state.prompts = action.payload;
    },
    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },

    // UI state actions
    setBetaHIVEConfirmation(state, action: PayloadAction<boolean>) {
      state.isBetaHIVEConfirmation = action.payload;
    },
    setStorySubmission(state, action: PayloadAction<boolean>) {
      state.isStorySubmission = action.payload;
    },

    // Reset state
    resetStorySubmission(state) {
      return initialState;
    },
  },
});

export const {
  setTitle,
  setStory,
  setAuthor,
  setHIVE,
  setBattleName,
  setContentSensitive,
  setContentWarnings,
  setPrompts,
  setStatus,
  setBetaHIVEConfirmation,
  setStorySubmission,
  resetStorySubmission,
} = storySubmissionSlice.actions;

export default storySubmissionSlice.reducer;
