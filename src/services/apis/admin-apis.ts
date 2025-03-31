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
    'Content-Type': 'application/json',
  },
});

// Function to update the nonce in the axios instance
export const updateAxiosNonce = (nonce: string) => {
  axiosInstance.defaults.headers.common['X-WP-Nonce'] = nonce;
};

// Function to wait for the nonce to be available
export const waitForNonce = async (): Promise<string> => {
  return new Promise((resolve) => {
    const checkNonce = () => {
      if (typeof wpApiSettings !== 'undefined' && wpApiSettings.nonce) {
        const nonce = wpApiSettings.nonce;
        updateAxiosNonce(nonce);
        resolve(nonce);
      } else {
        setTimeout(checkNonce, 100); // Retry after 100ms
      }
    };
    checkNonce();
  });
};

// Function to get all game content to update the Redux store w/ wp_options table
export const getAllGameContent =
  async (): Promise<gameSettingsSchema | null> => {
    try {
      console.log('Fetching game content...');
      const nonce = await waitForNonce();
      console.log('Nonce:', nonce);
      const response = await axiosInstance.get('/game_content');
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching game content:', error);
      return null;
    }
  };
