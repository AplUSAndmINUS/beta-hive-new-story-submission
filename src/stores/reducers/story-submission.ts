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
    storyImage: string; // Selected story image
    metadata: {
      isUserEditable: boolean;
      lastAdminUpdate: string | null;
      adminId: string | null;
    };
  };

  // Available story images for selection
  availableStoryImages: string[];

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
  isShared: true,

  // System-controlled fields (protected from user modification)
  system: {
    HIVE: '',
    battleName: '', // This will be set from admin settings
    prompts: [],
    contentWarnings: [],
    wordCount: 0,
    characterCount: 0,
    status: 'draft',
    lastModified: '',
    modifiedBy: 'system',
    version: 0,
    tags: [],
    storyImage: '', // Initially no image selected
    metadata: {
      isUserEditable: false,
      lastAdminUpdate: null,
      adminId: null,
    },
  },

  // Available story images for selection--hard coded due to WP Media Library URL structure
  availableStoryImages: [
    'storyImg1.png',
    'storyImg2.png',
    'storyImg3.png',
    'storyImg4.png',
  ],

  // UI state
  isBetaHIVEConfirmation: false,
  isStorySubmission: false,
};

const storySubmissionSlice = createSlice({
  name: 'storySubmission',
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
    setStoryImage(state, action: PayloadAction<string>) {
      state.system.storyImage = action.payload;
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
  setBattleName,
  setBetaHIVEConfirmation,
  setContentSensitive,
  setContentWarnings,
  setHIVE,
  setLastModified,
  setModifiedBy,
  setIsShared,
  setMetadata,
  setPrompts,
  setStatus,
  setStorySubmission,
  setStoryImage,
  setTags,
  setVersion,
  resetStorySubmission,
} = storySubmissionSlice.actions;

export default storySubmissionSlice.reducer;
