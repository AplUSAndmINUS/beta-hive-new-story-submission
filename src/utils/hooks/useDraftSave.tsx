import React from 'react';

import { useAppDispatch, useAppSelector } from 'src/stores/store';
import { setStory, setTitle } from 'src/stores/reducers/story-submission';
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
  const {
    system: { HIVE, prompts },
  } = useAppSelector((state) => state.storySubmission);
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
        dispatch(setStory(storyText));
        dispatch(setTitle(storyTitle));

        if (saveAction) {
          dispatch(saveAction(storyText));
        }

        // Prepare story data
        const storyData = {
          title: storyTitle,
          story: storyText,
          author: 'current_user_id', // This should come from your auth system
          isContentSensitive: undefined,
          isShared: false,
          system: {
            HIVE: HIVE || '',
            prompts: prompts || [],
            contentWarnings: ['None'],
            battleName: battleName,
            wordCount: storyText.trim().split(/\s+/).length,
            characterCount: storyText.length,
            status: 'Draft' as const,
            feedback: [],
            wins: 0,
            losses: 0,
            lastModified: new Date().toISOString(),
            modifiedBy: 'system' as const,
            version: 1,
            tags: [],
            metadata: {
              isUserEditable: false,
              lastAdminUpdate: null,
              adminId: null,
            },
          },
        };

        let response;
        if (draftId) {
          // Update existing draft
          response = await updateStory({ ...storyData, id: String(draftId) });
        } else {
          // Create new draft
          response = await addStory(storyData);
          if (response?.id) {
            setDraftId(Number(response.id));
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
    battleName,
    dispatch,
    draftId,
    HIVE,
    prompts,
    saveAction,
    storyText,
    storyTitle,
  ]);

  return { isLoading, isSaved, error, draftId };
};

export default useDraftSave;
