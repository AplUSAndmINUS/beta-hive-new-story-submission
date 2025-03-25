import axios from 'axios';

// import { CALENDAR_EVENTS, CONTENT_WARNINGS, PROMPT_SELECTIONS } from '../constants/admin-constants';
import {
  betaHIVESchema,
  gameSettingsSchema,
} from 'src/services/models/betaHIVE-selection.types';
import { promptsSchema } from 'src/services/models/prompt-selection.types';
import { contentWarningsSchema } from 'src/services/models/content-warnings.types';
import { calendarSchema } from 'src/services/models/calendar.types';

// define nonce wpApiSettings globally
declare const wpApiSettings: { nonce: string };

// Fallback nonce for local development
// const localNonce = process.env.REACT_APP_LOCAL_NONCE || '48e6d11d60';

// Base URL for the API
// const baseURL = process.env.REACT_APP_STAGING_API_URL || '/wp-json/custom/v1';
const baseURL = '/wp-json/custom/v1';

// Create an axios instance with the nonce token for WP backend access
// Comment out either the local or production instance depending on the environment
export const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    // 'X-WP-Nonce':
    //   typeof wpApiSettings !== 'undefined' ? wpApiSettings.nonce : localNonce,
    'X-WP-Nonce':
      typeof wpApiSettings !== 'undefined' ? wpApiSettings.nonce : 'c9a78bd1fa',
    'Content-Type': 'application/json',
  },
});

// Function to get all game content to update the Redux store w/ wp_options table
export const getAllGameContent =
  async (): Promise<gameSettingsSchema | null> => {
    try {
      const response = await axiosInstance.get('/game_content');
      return response.data;
    } catch (error) {
      console.error('Error fetching game content:', error);
      return null;
    }
  };

// Function to get min word count
export const getMinWordCount = async (): Promise<number | null> => {
  const data = await getAllGameContent();
  return data ? data.minWordCount : null;
};

// Function to get max word count
export const getMaxWordCount = async (): Promise<number | null> => {
  const data = await getAllGameContent();
  return data ? data.maxWordCount : null;
};

// Function to get beta hives count
export const getBetaHIVECount = async (): Promise<number | null> => {
  const data = await getAllGameContent();
  return data ? data.betaHIVECount : null;
};

// Function to get battle name
export const getBattleName = async (): Promise<string | null> => {
  const data = await getAllGameContent();
  return data ? data.battleName : null;
};

// Function to get minimum prompt selections
export const getMinPromptSelections = async (): Promise<number | null> => {
  const data = await getAllGameContent();
  return data ? data.minPromptSelections : null;
};

// Function to get number of losses
export const getNumOfLosses = async (): Promise<number | null> => {
  const data = await getAllGameContent();
  return data ? data.numOfLosses : null;
};

// Function to get content warnings count
export const getContentWarningsCount = async (): Promise<number | null> => {
  const data = await getAllGameContent();
  return data ? data.contentWarningsCount : null;
};

// Function to get calendar event count
export const getCalendarEventCount = async (): Promise<number | null> => {
  const data = await getAllGameContent();
  return data ? data.calendarEventCount : null;
};

// Function to get prompts count
export const getPromptsCount = async (): Promise<number | null> => {
  const data = await getAllGameContent();
  return data ? data.promptCount : null;
};

// Function to get countdown date
export const getCountdownDate = async (): Promise<string | null> => {
  const data = await getAllGameContent();
  return data ? data.countDownDate : null;
};

// Function to get all hives count
export const getAllHivesCount = async (): Promise<number | null> => {
  const data = await getAllGameContent();
  return data ? data.hives.length : null;
};

// Function to get all hives
export const getAllHives = async (): Promise<betaHIVESchema[] | null> => {
  const data = await getAllGameContent();
  return data ? data.hives : null;
};

// Function to get all prompts
export const getAllPrompts = async (): Promise<promptsSchema[] | null> => {
  const data = await getAllGameContent();
  return data ? data.prompts : null;
};

// Function to get content warnings
export const getContentWarnings = async (): Promise<
  contentWarningsSchema[] | null
> => {
  const data = await getAllGameContent();
  return data ? data.contentWarnings : null;
};

// Function to get all calendar events
export const getAllCalendarEvents = async (): Promise<
  calendarSchema[] | null
> => {
  const data = await getAllGameContent();
  return data ? data.calendarEvents : null;
};

// Function to update all calendar events
export const updateCalendarEvents = async (
  updatedEvents: calendarSchema[]
): Promise<calendarSchema[] | null> => {
  try {
    const response = await axiosInstance.put(
      '/update_calendar_events',
      updatedEvents
    );
    return response.data;
  } catch (error) {
    console.error('Error updating calendar events:', error);
    return null;
  }

  // Local API Testing to update all calendar events
  // CALENDAR_EVENTS = updatedEvents;
  // return CALENDAR_EVENTS;
};

// Function to update calendar event count
export const updateCalendarEventCount = async (
  eventCount: number
): Promise<number | null> => {
  try {
    const response = await axiosInstance.put('/update_calendar_event_count', {
      eventCount,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating calendar event count:', error);
    return null;
  }

  // Local API Testing to update calendar event count
  // const eventCount = 4;
  // return eventCount; --> Cannot be done from APIs due to store reducer needed
};

// Function to update all prompts
export const updatePrompts = async (
  updatedPrompts: promptsSchema[]
): Promise<promptsSchema[] | null> => {
  try {
    const response = await axiosInstance.put('/prompts', updatedPrompts);
    return response.data;
  } catch (error) {
    console.error('Error updating prompts:', error);
    return null;
  }

  // Local API Testing to update all prompts
  // PROMPT_SELECTIONS = updatedPrompts;
  // return PROMPT_SELECTIONS;
};

// Function to update prompts count
export const updatePromptsCount = async (
  promptsCount: number
): Promise<number | null> => {
  try {
    const response = await axiosInstance.put('/update_prompts_count', {
      promptsCount,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating prompts count:', error);
    return null;
  }

  // Local API Testing to update prompts count
  // const promptsCount = 4;
  // return promptsCount; --> Cannot be done from APIs due to store reducer needed
};

// Function to update content warnings
export const updateContentWarnings = async (
  updatedWarnings: contentWarningsSchema[]
): Promise<contentWarningsSchema[] | null> => {
  try {
    const response = await axiosInstance.put(
      '/update_content_warnings',
      updatedWarnings
    );
    return response.data;
  } catch (error) {
    console.error('Error updating content warnings:', error);
    return null;
  }

  // Local API Testing to update content warnings
  // CONTENT_WARNINGS = updatedWarnings;
  // return CONTENT_WARNINGS;
};

// Function to update number of content warnings
export const updateNumOfContentWarnings = async (
  numOfContentWarnings: number
): Promise<number | null> => {
  try {
    const response = await axiosInstance.put('/update_content_warning_count', {
      numOfContentWarnings,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating number of content warnings:', error);
    return null;
  }

  // Local API Testing to update number of content warnings
  // const numOfContentWarnings = 4;
  // return numOfContentWarnings; --> Cannot be done from APIs due to store reducer needed
};

// Function to update number of losses
export const updateNumOfLosses = async (
  numOfLosses: number
): Promise<number | null> => {
  try {
    const response = await axiosInstance.put('/update_num_of_losses', {
      numOfLosses,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating number of losses:', error);
    return null;
  }

  // Local API Testing to update number of losses
  // const numOfLosses = 4;
  // return numOfLosses; --> Cannot be done from APIs due to store reducer needed
};

// Function to update countdown date
export const updateCountdownDate = async (
  countdownDate: string
): Promise<string | null> => {
  try {
    const response = await axiosInstance.put('/update_countdown_date', {
      countdownDate,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating countdown date:', error);
    return null;
  }

  // Local API Testing to update countdown date
  // const newDate = moment(countdownDate).format('YYYY-MM-DD');
  // return newDate; --> Cannot be done from APIs due to store reducer needed
};

// Function to update min word count
export const updateMinWordCount = async (
  minWordCount: number
): Promise<number | null> => {
  try {
    const response = await axiosInstance.put('/update_min_word_count', {
      minWordCount,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating min word count:', error);
    return null;
  }

  // Local API Testing to update min word count
  // const minWordCount = 500;
  // return minWordCount; --> Cannot be done from APIs due to store reducer needed
};

// Function to update max word count
export const updateMaxWordCount = async (
  maxWordCount: number
): Promise<number | null> => {
  try {
    const response = await axiosInstance.put('/update_max_word_count', {
      maxWordCount,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating max word count:', error);
    return null;
  }

  // Local API Testing to update max word count
  // const maxWordCount = 1000;
  // return maxWordCount; --> Cannot be done from APIs due to store reducer needed
};

// Function to update beta hives count
export const updateBetaHIVECount = async (
  betaHIVECount: number
): Promise<number | null> => {
  try {
    const response = await axiosInstance.put('/update_beta_hive_count', {
      betaHIVECount,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating beta hives count:', error);
    return null;
  }

  // Local API Testing to update beta hives count
  // const betaHIVECount = 4;
  // return betaHIVECount; --> Cannot be done from APIs due to store reducer needed
};

// Function to update Battle Name
export const updateBattleName = async (
  battleName: string
): Promise<string | null> => {
  try {
    const response = await axiosInstance.put('/update_battle_name', {
      battleName,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating battle name:', error);
    return null;
  }

  // Local API Testing to update battle name
  // const battleName = 'Battle of the Hives';
  // return battleName; --> Cannot be done from APIs due to store reducer needed
};

// Function to update beta hives
export const updateBetaHIVES = async (
  updatedBetaHIVES: betaHIVESchema[]
): Promise<betaHIVESchema[] | null> => {
  try {
    const response = await axiosInstance.put('/update_hives', updatedBetaHIVES);
    return response.data;
  } catch (error) {
    console.error('Error updating beta hives:', error);
    return null;
  }

  // Local API Testing to update beta hives
  // BETA_HIVES = updatedBetaHIVES;
  // return BETA_HIVES;
};

// Function to update minimum prompt selections
export const updateMinPromptSelections = async (
  minPromptSelections: number
): Promise<number | null> => {
  try {
    const response = await axiosInstance.put('/update_min_prompt_selections', {
      minPromptSelections,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating minimum prompt selections:', error);
    return null;
  }

  // Local API Testing to update minimum prompt selections
  // const minPromptSelections = 4;
  // return minPromptSelections; --> Cannot be done from APIs due to store reducer needed
};
