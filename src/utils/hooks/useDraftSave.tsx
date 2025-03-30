import React from 'react';

import { useAppDispatch } from 'src/stores/store';
import {
  setStorySubmission,
  setStoryTitle,
} from 'src/stores/reducers/story-submission';
import { addStory, updateStory } from 'src/services/apis/stories-apis';

export const useDraftSave = (
  storyText: string,
  storyTitle: string,
  saveAction?: (text: string) => { type: string; payload: string }
) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [draftId, setDraftId] = React.useState<number | null>(null);
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
        // Update Redux store
        dispatch(setStorySubmission(storyText));
        dispatch(setStoryTitle(storyTitle));

        if (saveAction) {
          dispatch(saveAction(storyText));
        }

        // Prepare story data
        const storyData = {
          title: storyTitle,
          story: storyText,
          status: 'draft', // WordPress uses lowercase 'draft'
          author: 'current_user_id', // You'll need to get this from your auth system
          HIVE: '', // This will be set when the story is submitted
          prompts: [], // This will be set when the story is submitted
          isContentSensitive: false,
          contentWarnings: ['None'],
          battleName: 'micro-fiction',
          wordCount: storyText.trim().split(/\s+/).length,
          characterCount: storyText.length,
          feedback: [],
          wins: 0,
          losses: 0,
        };

        let response;
        if (draftId) {
          // Update existing draft
          response = await updateStory({ ...storyData, id: draftId });
        } else {
          // Create new draft
          response = await addStory(storyData);
          if (response?.id) {
            setDraftId(response.id);
          }
        }

        if (response) {
          setIsSaved(true);
        } else {
          throw new Error('Failed to save draft');
        }
      } catch (err) {
        setError('Failed to save draft');
        console.error('Error saving draft:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(handleSave, 2500); // Auto-save after 2.5 seconds of inactivity

    return () => clearTimeout(timer); // Clear timeout if user types again
  }, [storyText, storyTitle, dispatch, saveAction, draftId]);

  return { isLoading, isSaved, error, draftId };
};

export default useDraftSave;
