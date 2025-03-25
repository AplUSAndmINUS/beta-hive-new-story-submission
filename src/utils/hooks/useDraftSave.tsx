import React from 'react';

import { useAppDispatch } from 'src/stores/store';
import {
  setStorySubmission,
  setStoryTitle,
} from 'src/stores/reducers/story-submission';

export const useDraftSave = (
  storyText: string,
  storyTitle: string,
  saveAction?: (text: string) => { type: string; payload: string }
) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>('');
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (storyText.trim() === '' || storyTitle.trim() === '') {
      return; // Don't save empty storyText or storyTitle
    }

    const handleSave = async () => {
      setIsLoading(true);
      setIsSaved(false);
      setError(null);

      try {
        dispatch(setStorySubmission(storyText));
        dispatch(setStoryTitle(storyTitle));
        if (saveAction) {
          dispatch(saveAction(storyText));
        }
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate save delay
        setIsSaved(true);
      } catch (err) {
        setError('Failed to save draft');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(handleSave, 2500); // Auto-save after 2.5 seconds of inactivity

    return () => clearTimeout(timer); // Clear timeout if user types again
  }, [storyText, storyTitle, dispatch, saveAction]);

  return { isLoading, isSaved, error };
};

export default useDraftSave;
