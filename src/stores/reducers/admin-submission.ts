import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

import { BETAHIVE_SELECTIONS } from 'src/services/constants/betaHIVE-constants';
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
import {
  fetchAdminData,
  submitBattleName,
  submitCalendarEventCount,
  submitCalendarEvents,
  submitContentWarnings,
  submitCountdownDate,
  submitMaxWordCount,
  submitMinPromptSelections,
  submitMinWordCount,
  submitNumOfCalendarEvents,
  submitNumOfContentWarnings,
  submitNumOfLosses,
  submitPrompts,
  submitPromptsCount,
} from 'src/stores/middleware/admin-thunks';

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
  isCalendarEventCountLoading: boolean;
  isContentWarningCountLoading: boolean;
  isBetaHIVECountLoading: boolean;
  isBattleNameLoading: boolean;
  isCalendarEventsLoading: boolean;
  isCountdownDateLoading: boolean;
  isMinPromptSelectionsLoading: boolean;
  isNumOfLossesLoading: boolean;
  isPromptsCountLoading: boolean;
  isPromptsLoading: boolean;
  isMinWordCountLoading: boolean;
  isMaxWordCountLoading: boolean;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isAdminDataFetched: boolean;
  isAdminDataLoading: boolean;
  isAdminDataSuccess: boolean;
  isAdminDataError: boolean;
  adminData: gameSettingsSchema | null;
}

const initialState: AdminSubmissionState = {
  battleName: 'Battle of the HIVEs',
  betaHIVECount: 3,
  betaHIVEs: [...BETAHIVE_SELECTIONS],
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
  isBattleNameLoading: false,
  isBetaHIVECountLoading: false,
  isCalendarEventsLoading: false,
  isCalendarEventCountLoading: false,
  isCountdownDateLoading: false,
  isContentWarningCountLoading: false,
  isMaxWordCountLoading: false,
  isMinPromptSelectionsLoading: false,
  isMinWordCountLoading: false,
  isNumOfLossesLoading: false,
  isPromptsCountLoading: false,
  isPromptsLoading: false,
  error: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  isAdminDataFetched: false,
  isAdminDataLoading: false,
  isAdminDataSuccess: false,
  isAdminDataError: false,
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
        state.isAdminDataLoading = true;
        state.isAdminDataSuccess = false;
        state.isAdminDataError = false;
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.isAdminDataLoading = false;
        state.isAdminDataSuccess = true;
        state.isAdminDataError = false;
        state.adminData = action.payload;
        state.isAdminDataFetched = true;
      })
      .addCase(fetchAdminData.rejected, (state) => {
        state.isAdminDataLoading = false;
        state.isAdminDataSuccess = false;
        state.isAdminDataError = true;
      })
      .addCase(submitBattleName.pending, (state) => {
        state.isBattleNameLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitBattleName.fulfilled, (state) => {
        state.isBattleNameLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitBattleName.rejected, (state, action) => {
        state.isBattleNameLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitCalendarEvents.pending, (state) => {
        state.isCalendarEventsLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitCalendarEvents.fulfilled, (state) => {
        state.isCalendarEventsLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitCalendarEvents.rejected, (state, action) => {
        state.isCalendarEventsLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitCalendarEventCount.pending, (state) => {
        state.isCalendarEventCountLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitCalendarEventCount.fulfilled, (state) => {
        state.isCalendarEventCountLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitCalendarEventCount.rejected, (state, action) => {
        state.isCalendarEventCountLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitContentWarnings.pending, (state) => {
        state.isContentWarningCountLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitCountdownDate.pending, (state) => {
        state.isCountdownDateLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitCountdownDate.fulfilled, (state) => {
        state.isCountdownDateLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitCountdownDate.rejected, (state, action) => {
        state.isCountdownDateLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitContentWarnings.fulfilled, (state) => {
        state.isContentWarningCountLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitContentWarnings.rejected, (state, action) => {
        state.isContentWarningCountLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitMaxWordCount.pending, (state) => {
        state.isMaxWordCountLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitMaxWordCount.fulfilled, (state) => {
        state.isMaxWordCountLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitMaxWordCount.rejected, (state, action) => {
        state.isMaxWordCountLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitMinPromptSelections.pending, (state) => {
        state.isMinPromptSelectionsLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitMinPromptSelections.fulfilled, (state) => {
        state.isMinPromptSelectionsLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitMinPromptSelections.rejected, (state, action) => {
        state.isMinPromptSelectionsLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitMinWordCount.pending, (state) => {
        state.isMinWordCountLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitMinWordCount.fulfilled, (state) => {
        state.isMinWordCountLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitMinWordCount.rejected, (state, action) => {
        state.isMinWordCountLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitNumOfCalendarEvents.pending, (state) => {
        state.isCalendarEventCountLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitNumOfCalendarEvents.fulfilled, (state) => {
        state.isCalendarEventCountLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitNumOfCalendarEvents.rejected, (state, action) => {
        state.isCalendarEventCountLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitNumOfContentWarnings.pending, (state) => {
        state.isContentWarningCountLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitNumOfContentWarnings.fulfilled, (state) => {
        state.isContentWarningCountLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitNumOfContentWarnings.rejected, (state, action) => {
        state.isContentWarningCountLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitNumOfLosses.pending, (state) => {
        state.isNumOfLossesLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitNumOfLosses.fulfilled, (state) => {
        state.isNumOfLossesLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitNumOfLosses.rejected, (state, action) => {
        state.isNumOfLossesLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitPrompts.pending, (state) => {
        state.isPromptsLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitPrompts.fulfilled, (state) => {
        state.isPromptsLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitPrompts.rejected, (state, action) => {
        state.isPromptsLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addCase(submitPromptsCount.pending, (state) => {
        state.isPromptsCountLoading = true;
        state.isSuccess = false;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitPromptsCount.fulfilled, (state) => {
        state.isPromptsCountLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.error = null;
      })
      .addCase(submitPromptsCount.rejected, (state, action) => {
        state.isPromptsCountLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.error = action.payload as string;
      })
      .addDefaultCase((state) => {
        state.isLoading = false;
      });
  }
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
