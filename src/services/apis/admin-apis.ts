import axios from 'axios';

// import { CALENDAR_EVENTS, CONTENT_WARNINGS, PROMPT_SELECTIONS } from '../constants/admin-constants';
import { gameSettingsSchema } from 'src/services/models/betaHIVE-selection.types';

// define nonce wpApiSettings globally
declare const wpApiSettings: { nonce: string } | undefined;

// Fallback nonce for local development
const localNonce = process.env.REACT_APP_LOCAL_NONCE || 'bf240c9772';

// Base URL for the API
const baseURL = process.env.REACT_APP_STAGING_API_URL || '/wp-json/custom/v1';

// Create an axios instance with the nonce token for WP backend access
export const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'X-WP-Nonce':
      typeof wpApiSettings !== 'undefined' ? wpApiSettings.nonce : localNonce,
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
      if (axios.isAxiosError(error)) {
        console.error('Request config:', error.config);
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
      return null;
    }
  };
