import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface based on story schema
interface StorySubmissionState {
  // User-editable fields
  title: string;
  story: string;
  author: string;
  isContentSensitive?: boolean;
  isShared: boolean;

  // System-controlled fields (protected from user modification)
  system: {
    HIVE: string;
    battleName: string;
    prompts: string[];
    contentWarnings: string[];
    wordCount: number;
    characterCount: number;
    status: string;
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

  // UI state
  isBetaHIVEConfirmation: boolean;
  isStorySubmission: boolean;
}

const initialState: StorySubmissionState = {
  // User-editable fields
  title: '',
  story: '',
  author: '', // This should come from user authentication
  isContentSensitive: undefined,
  isShared: false,

  // System-controlled fields (protected from user modification)
  system: {
    HIVE: '',
    battleName: 'Battle of the HIVEs', // This should come from admin settings
    prompts: [],
    contentWarnings: [],
    wordCount: 0,
    characterCount: 0,
    status: 'draft',
    lastModified: '',
    modifiedBy: 'system',
    version: 0,
    tags: [],
    metadata: {
      isUserEditable: false,
      lastAdminUpdate: null,
      adminId: null,
    },
  },

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
      state.system.characterCount = action.payload.length;
      state.system.wordCount = action.payload.trim().split(/\s+/).length;
    },
    setAuthor(state, action: PayloadAction<string>) {
      state.author = action.payload;
    },
    setHIVE(state, action: PayloadAction<string>) {
      state.system.HIVE = action.payload;
    },
    setBattleName(state, action: PayloadAction<string>) {
      state.system.battleName = action.payload;
    },

    // Content and warnings actions
    setContentSensitive(state, action: PayloadAction<boolean>) {
      state.isContentSensitive = action.payload;
      if (!action.payload) {
        state.system.contentWarnings = [];
      }
    },
    setContentWarnings(state, action: PayloadAction<string[]>) {
      state.system.contentWarnings = action.payload;
    },

    // Story metadata actions
    setPrompts(state, action: PayloadAction<string[]>) {
      state.system.prompts = action.payload;
    },
    setStatus(state, action: PayloadAction<string>) {
      state.system.status = action.payload;
    },

    // UI state actions
    setBetaHIVEConfirmation(state, action: PayloadAction<boolean>) {
      state.isBetaHIVEConfirmation = action.payload;
    },
    setStorySubmission(state, action: PayloadAction<boolean>) {
      state.isStorySubmission = action.payload;
    },
    setIsShared(state, action: PayloadAction<boolean>) {
      state.isShared = action.payload;
    },

    // System metadata actions
    setLastModified(state, action: PayloadAction<string>) {
      state.system.lastModified = action.payload;
    },
    setModifiedBy(state, action: PayloadAction<'system' | 'admin'>) {
      state.system.modifiedBy = action.payload;
    },
    setVersion(state, action: PayloadAction<number>) {
      state.system.version = action.payload;
    },
    setTags(state, action: PayloadAction<string[]>) {
      state.system.tags = action.payload;
    },
    setMetadata(
      state,
      action: PayloadAction<{
        isUserEditable: boolean;
        lastAdminUpdate: string | null;
        adminId: string | null;
      }>
    ) {
      state.system.metadata = action.payload;
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
  setIsShared,
  setLastModified,
  setModifiedBy,
  setVersion,
  setTags,
  setMetadata,
  resetStorySubmission,
} = storySubmissionSlice.actions;

export default storySubmissionSlice.reducer;
