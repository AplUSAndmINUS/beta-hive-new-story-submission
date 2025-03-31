// Get the base path from package.json or default to /enter-the-arena
export const BASE_PATH = process.env.PUBLIC_URL || '/enter-the-arena';

// Helper function to get the full path for assets
export const getAssetPath = (path: string) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_PATH}/${cleanPath}`;
};

// Base URLs for different environments
const BASE_URLS = {
  staging: 'https://staging-203c-battlehivefictioncom.wpcomstaging.com',
  production: 'https://battlehivefiction.com',
  local: 'http://localhost:3000',
};

// Determine the current environment
const getCurrentEnvironment = () => {
  const hostname = window.location.hostname;
  if (hostname.includes('staging')) return 'staging';
  if (hostname.includes('battlehivefiction.com')) return 'production';
  return 'local';
};

// Get the base URL for the current environment
export const getBaseUrl = () => {
  const env = getCurrentEnvironment();
  return BASE_URLS[env];
};

// Helper function to get the full media URL
export const getMediaUrl = (path: string) => {
  if (getCurrentEnvironment() === 'local') {
    // For local development, load from the public/images directory
    return `/images/${path}`;
  }
  const baseUrl = getBaseUrl();
  return `${baseUrl}/wp-content/uploads/${path}`;
};
