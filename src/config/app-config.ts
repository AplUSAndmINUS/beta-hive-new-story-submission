// Get the base path from package.json or default to /enter-the-arena
export const BASE_PATH = process.env.PUBLIC_URL || '/enter-the-arena';

// Helper function to get the full path for assets
export const getAssetPath = (path: string) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_PATH}/${cleanPath}`;
};
