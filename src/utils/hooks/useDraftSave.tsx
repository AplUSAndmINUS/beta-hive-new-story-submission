import React from 'react';

import { useAppDispatch, useAppSelector } from 'src/stores/store';
import { setStory, setTitle } from 'src/stores/reducers/story-submission';
import {
  addStoryThunk,
  updateStoryThunk,
} from 'src/stores/middleware/story-thunks';
import { CreateStorySchema } from 'src/services/models/battleHIVE.types';

export const useDraftSave = (
  storyText: string,
  storyTitle: string,
  saveAction?: (text: string) => { type: string; payload: string }
) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [draftId, setDraftId] = React.useState<string | null>(null);
  const dispatch = useAppDispatch();

  // Get the current user's HIVE selection and prompts from Redux store
  const {
    system: { HIVE, prompts, contentWarnings, storyImage },
    isShared,
    author,
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
        const storyData: CreateStorySchema = {
          title: storyTitle,
          story: storyText,
          author: author || 'anonymous', // Use author from store or fallback to anonymous
          isContentSensitive: undefined,
          isShared: isShared || false,
          system: {
            HIVE: HIVE || '',
            prompts: prompts || [],
            contentWarnings: contentWarnings || ['None'], // Use contentWarnings from store
            battleName: battleName,
            feedback: [],
            wins: 0,
            losses: 0,
            wordCount: storyText.trim().split(/\s+/).length,
            characterCount: storyText.length,
            status: 'Draft' as const,
            lastModified: new Date().toISOString(),
            modifiedBy: 'system' as const,
            storyImage: storyImage || '',
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
          response = await dispatch(
            updateStoryThunk({ id: draftId, story: storyData })
          ).unwrap();
        } else {
          // Create new draft
          response = await dispatch(addStoryThunk(storyData)).unwrap();
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
    battleName,
    dispatch,
    draftId,
    HIVE,
    prompts,
    saveAction,
    storyText,
    storyTitle,
    isShared,
    author,
    contentWarnings,
  ]);

  return { isLoading, isSaved, error, draftId };
};

export default useDraftSave;
