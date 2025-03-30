import React from 'react';

import SaveSpinner from 'src/components/draft-save-spinner/draft-save-spinner';
import Selections from 'src/components/selections/selections';
import NavigateButtons from 'src/components/navigate-buttons/navigate-buttons';
import WordCount from 'src/components/word-count/word-count';
import InputType from 'src/components/form-elements/input/input-type';
import { useAppDispatch, useAppSelector } from 'src/stores/store';
import { setStory, setTitle } from 'src/stores/reducers/story-submission';
import useDraftSave from 'src/utils/hooks/useDraftSave';
import useWordCount from 'src/utils/hooks/useWordCount';
import { fetchAdminData } from 'src/stores/middleware/admin-thunks';

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 100;

export const StorySubmission: React.FC = () => {
  const dispatch = useAppDispatch();
  const { story, title } = useAppSelector((state) => state.storySubmission);
  const { minWordCount, maxWordCount } = useAppSelector(
    (state) => state.adminSubmission
  );

  const [isNextDisabled, setIsNextDisabled] = React.useState(true);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [storyText, setStoryText] = React.useState(story || '');
  const [storyTitleState, setStoryTitleState] = React.useState(title || '');

  const { error, isLoading, isSaved } = useDraftSave(
    storyText,
    storyTitleState
  );
  const userWordCount = useWordCount(storyText);

  React.useEffect(() => {
    if (!minWordCount || !maxWordCount) {
      dispatch(fetchAdminData());
    }
  }, [dispatch, minWordCount, maxWordCount]);

  React.useEffect(() => {
    // Update Redux store when local state changes
    if (storyText !== story) {
      dispatch(setStory(storyText));
    }
    if (storyTitleState !== title) {
      dispatch(setTitle(storyTitleState));
    }
  }, [storyText, storyTitleState, dispatch, story, title]);

  React.useEffect(() => {
    // Validate form and collect all validation errors
    const errors: string[] = [];
    const trimmedTitle = storyTitleState.trim();
    const trimmedText = storyText.trim();
    const wordCount = trimmedText.split(/\s+/).length;

    // Title validation
    if (trimmedTitle.length === 0) {
      errors.push('Title is required');
    } else if (trimmedTitle.length < MIN_TITLE_LENGTH) {
      errors.push(`Title must be at least ${MIN_TITLE_LENGTH} characters`);
    } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
      errors.push(`Title must be no more than ${MAX_TITLE_LENGTH} characters`);
    }

    // Story validation
    if (trimmedText.length === 0) {
      errors.push('Story text is required');
    } else if (wordCount < minWordCount) {
      errors.push(`Story must be at least ${minWordCount} words`);
    } else if (wordCount > maxWordCount) {
      errors.push(`Story must be no more than ${maxWordCount} words`);
    }

    setValidationErrors(errors);
    setIsNextDisabled(errors.length > 0);
  }, [storyText, storyTitleState, minWordCount, maxWordCount]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target instanceof HTMLTextAreaElement) {
      setStoryText(e.target.value);
    } else {
      // Remove any special characters from title
      const sanitizedTitle = e.target.value.replace(/[^\w\s-]/g, '');
      setStoryTitleState(sanitizedTitle);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row d-flex justify-content-between align-items-center'>
        <div className='col'>
          <h1 className='bd-title pb-2 mt-4'>Write your story</h1>
          <p className='text-muted pb-2 mt-2 fs-5'>
            Please write your story below, then click &quot;Submit Story&quot;.{' '}
            <br />
            Don't worry: Your story will autosave, and you can edit it anytime
            after submission.
          </p>
        </div>
        <Selections />
      </div>
      <div className='row'>
        <InputType
          name='storyTitle'
          value={storyTitleState}
          isDisabled={false}
          label={'Story title'}
          isRequired
          onChange={handleChange}
          placeholder='Enter your story title here'
          type='text'
          flex='start'
          error={validationErrors.find((err) => err.includes('Title'))}
        />
      </div>
      <div className='row'>
        <h4 className='pb-2 mt-3 ms-1'>Story</h4>
        <textarea
          autoFocus
          className={`form-control ms-3 ${validationErrors.some((err) => err.includes('Story')) ? 'is-invalid' : ''}`}
          rows={10}
          placeholder='Enter your story here'
          value={storyText}
          onChange={handleChange}
        ></textarea>
        {validationErrors.some((err) => err.includes('Story')) && (
          <div className='invalid-feedback d-block ms-3'>
            {validationErrors.find((err) => err.includes('Story'))}
          </div>
        )}
        <div className='d-flex flex-row justify-content-between align-items-center w-100'>
          <div className='d-flex flex-row justify-content-space-between'>
            <WordCount wordCount={userWordCount} />
            <SaveSpinner
              error={error}
              isLoading={isLoading}
              isSaved={isSaved}
            />
          </div>
          <NavigateButtons
            backNavigation='Prompt Selection'
            isNextDisabled={isNextDisabled}
            isStorySubmission
            nextButtonText='Next'
            nextNavigation='Content Warning'
          />
        </div>
      </div>
    </div>
  );
};

export default StorySubmission;
