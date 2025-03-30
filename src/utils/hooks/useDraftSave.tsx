import React from 'react';

import { useAppDispatch, useAppSelector } from 'src/stores/store';
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

  // Get the current user's HIVE selection and prompts from Redux store
  const { betaHIVESelection, promptSelections } = useAppSelector(
    (state) => state.storySubmission
  );
  const { battleName } = useAppSelector((state) => state.adminSubmission);

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
          author: 'current_user_id', // This should come from your auth system
          HIVE: betaHIVESelection || '', // Use selected HIVE if available
          prompts: promptSelections || [], // Use selected prompts if available
          isContentSensitive: false,
          contentWarnings: ['None'],
          battleName: battleName || 'Battle of the HIVEs',
          wordCount: storyText.trim().split(/\s+/).length,
          status: 'draft',
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
  }, [
    storyText,
    storyTitle,
    dispatch,
    saveAction,
    draftId,
    betaHIVESelection,
    promptSelections,
  ]);

  return { isLoading, isSaved, error, draftId };
};

export default useDraftSave;
