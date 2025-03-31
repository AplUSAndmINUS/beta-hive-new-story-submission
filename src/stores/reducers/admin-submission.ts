import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

// import { BETAHIVE_SELECTIONS } from 'src/services/constants/betaHIVE-constants';
import {
  CALENDAR_EVENTS,
  CONTENT_WARNINGS,
  PROMPT_SELECTIONS,
} from 'src/services/constants/admin-constants';
import { betaHIVESchema } from 'src/services/models/betaHIVE-selection.types';
import { calendarSchema } from 'src/services/models/calendar.types';
import { contentWarningsSchema } from 'src/services/models/content-warnings.types';
import { promptsSchema } from 'src/services/models/prompt-selection.types';
import { gameSettingsSchema } from 'src/services/models/betaHIVE-selection.types';
import { fetchAdminData } from 'src/stores/middleware/admin-thunks';

interface AdminSubmissionState {
  battleName: string;
  betaHIVECount: number;
  betaHIVEs: betaHIVESchema[];
  calendarEventCount: number;
  calendarEvents: calendarSchema[];
  contentWarningCount: number;
  contentWarnings: contentWarningsSchema[];
  countdownDate: string;
  minPromptSelections: number;
  numOfLosses: number;
  promptsCount: number;
  prompts: promptsSchema[];
  minWordCount: number;
  maxWordCount: number;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  adminData: gameSettingsSchema | null;
}

const initialState: AdminSubmissionState = {
  battleName: 'Battle of the HIVEs',
  betaHIVECount: 3,
  betaHIVEs: [
    {
      id: '1',
      name: 'Bumble HIVE',
      imgSource: 'hive1.png',
      description: 'Cozy/Romance/Meet Cute',
    },
    {
      id: '2',
      name: 'Yellow Jacket HIVE',
      imgSource: 'hive2.png',
      description: 'History/Mystery/Adventure',
    },
    {
      id: '3',
      name: 'The Chaos HIVE',
      imgSource: 'hive3.png',
      description: 'Inanimate Objects/Fantasical Creatures/Otherworld',
    },
  ],
  calendarEventCount: 4,
  calendarEvents: [...CALENDAR_EVENTS],
  contentWarningCount: 4,
  contentWarnings: [...CONTENT_WARNINGS],
  countdownDate: moment('2025-04-14').format('MM-DD-YYYY'),
  minPromptSelections: 2,
  numOfLosses: 3,
  promptsCount: 10,
  prompts: [...PROMPT_SELECTIONS],
  minWordCount: 250,
  maxWordCount: 1000,
  error: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  adminData: null,
};

const adminSubmissionSlice = createSlice({
  name: 'adminSubmissionReducer',
  initialState,
  reducers: {
    setBattleName(state, action: PayloadAction<string>) {
      state.battleName = action.payload;
    },
    setBetaHIVECount(state, action: PayloadAction<number>) {
      state.betaHIVECount = action.payload;
    },
    setBetaHIVEs(state, action: PayloadAction<betaHIVESchema[]>) {
      state.betaHIVEs = [...action.payload];
    },
    setCalendarEventCount(state, action: PayloadAction<number>) {
      state.calendarEventCount = action.payload;
    },
    setCalendarEvents(state, action: PayloadAction<calendarSchema[]>) {
      state.calendarEvents = [...action.payload];
    },
    setContentWarningCount(state, action: PayloadAction<number>) {
      state.contentWarningCount = action.payload;
    },
    setContentWarnings(state, action: PayloadAction<contentWarningsSchema[]>) {
      state.contentWarnings = [...action.payload];
    },
    setCountdownDate(state, action: PayloadAction<string>) {
      state.countdownDate = action.payload;
    },
    setMinPromptSelections(state, action: PayloadAction<number>) {
      state.minPromptSelections = action.payload;
    },
    setNumOfLosses(state, action: PayloadAction<number>) {
      state.numOfLosses = action.payload;
    },
    setPromptCount(state, action: PayloadAction<number>) {
      state.promptsCount = action.payload;
    },
    setPrompts(state, action: PayloadAction<promptsSchema[]>) {
      state.prompts = [...action.payload];
    },
    setMinWordCount(state, action: PayloadAction<number>) {
      state.minWordCount = action.payload;
    },
    setMaxWordCount(state, action: PayloadAction<number>) {
      state.maxWordCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.adminData = action.payload;

        // Update all state values with the fetched data
        state.battleName = action.payload.battleName;
        state.betaHIVECount = action.payload.betaHIVECount;
        state.betaHIVEs = action.payload.hives;
        state.calendarEventCount = action.payload.calendarEventCount;
        state.calendarEvents = action.payload.calendarEvents;
        state.contentWarningCount = action.payload.contentWarningsCount;
        state.contentWarnings = action.payload.contentWarnings;
        state.countdownDate = action.payload.countDownDate;
        state.minPromptSelections = action.payload.minPromptSelections;
        state.numOfLosses = action.payload.numOfLosses;
        state.promptsCount = action.payload.promptCount;
        state.prompts = action.payload.prompts;
        state.minWordCount = action.payload.minWordCount;
        state.maxWordCount = action.payload.maxWordCount;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.error.message ?? null;
      });
  },
});

export const {
  setBattleName,
  setBetaHIVEs,
  setBetaHIVECount,
  setCalendarEventCount,
  setCalendarEvents,
  setContentWarningCount,
  setContentWarnings,
  setCountdownDate,
  setMinPromptSelections,
  setNumOfLosses,
  setPromptCount,
  setPrompts,
  setMinWordCount,
  setMaxWordCount,
} = adminSubmissionSlice.actions;

export default adminSubmissionSlice.reducer;
