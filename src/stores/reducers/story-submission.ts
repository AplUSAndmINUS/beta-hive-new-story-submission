import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StorySubmissionState {
  betaHIVESelection: string;
  isBetaHIVEConfirmation: boolean;
  contentWarning: string;
  contentSensitivities: string[];
  characterSelection: string;
  isStorySubmission: boolean;
  settingSelection: string;
  promptSelections: string[];
  storyTitle: string;
  storySubmission: string;
  storySubmissionCharacterCount: number;
  storySubmissionWordCount: number;
}

const initialState: StorySubmissionState = {
  betaHIVESelection: '',
  isBetaHIVEConfirmation: false,
  isStorySubmission: false,
  contentWarning: '',
  contentSensitivities: [],
  characterSelection: '',
  settingSelection: '',
  promptSelections: [],
  storyTitle: '',
  storySubmission: '',
  storySubmissionCharacterCount: 0,
  storySubmissionWordCount: 0,
};

const storySubmissionSlice = createSlice({
  name: 'storySubmissionReducer',
  initialState,
  reducers: {
    setBetaHIVEConfirmation(state, action: PayloadAction<boolean>) {
      state.isBetaHIVEConfirmation = action.payload;
    },
    setBetaHIVESelection(state, action: PayloadAction<string>) {
      state.betaHIVESelection = action.payload;
    },
    setContentSensitivities(state, action: PayloadAction<string[]>) {
      state.contentSensitivities = action.payload;
    },
    setIsContentWarning(state, action: PayloadAction<string>) {
      state.contentWarning = action.payload;
      if (action.payload.includes('No')) {
        state.contentSensitivities = [];
      }
    },
    setCharacterSelection(state, action: PayloadAction<string>) {
      state.characterSelection = action.payload;
    },
    setPromptSelections(state, action: PayloadAction<string[]>) {
      state.promptSelections = action.payload;
    },
    setIsStorySubmission(state, action: PayloadAction<boolean>) {
      state.isStorySubmission = action.payload;
    },
    setSettingSelection(state, action: PayloadAction<string>) {
      state.settingSelection = action.payload;
    },
    setStorySubmission(state, action: PayloadAction<string>) {
      state.storySubmission = action.payload;
      state.storySubmissionCharacterCount = action.payload.length;
      state.storySubmissionWordCount = action.payload.trim().split(/\s+/).length;
    },
    setStoryTitle(state, action: PayloadAction<string>) {
      state.storyTitle = action.payload;
    },
    setStoryCharacterCount(state, action: PayloadAction<number>) {
      state.storySubmissionCharacterCount = action.payload;
    },
    setStoryWordCount(state, action: PayloadAction<number>) {
      state.storySubmissionWordCount = action.payload;
    },
  },
});

export const {
  setBetaHIVEConfirmation,
  setBetaHIVESelection,
  setContentSensitivities,
  setIsContentWarning,
  setCharacterSelection,
  setPromptSelections,
  setSettingSelection,
  setStorySubmission,
  setStoryTitle,
  setStoryCharacterCount,
  setStoryWordCount
} = storySubmissionSlice.actions;

export default storySubmissionSlice.reducer;
