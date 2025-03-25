import React from 'react';

import useDraftSave from 'shared/utils/hooks/useDraftSave';
import SaveSpinner from 'shared/components/draft-save-spinner/draft-save-spinner';
import Selections from 'shared/components/selections/selections';
import NavigateButtons from 'shared/components/navigate-buttons/navigate-buttons';
import WordCount from 'shared/components/word-count/word-count';
import useWordCount from 'shared/utils/hooks/useWordCount';
import { useAppSelector } from 'shared/stores/store';
import InputType from 'shared/components/form-elements/input/input-type';

export const StorySubmission: React.FC = () => {
  const { storySubmission, storySubmissionWordCount, storyTitle } =
    useAppSelector((state) => state.storySubmission);
  const [isNextDisabled, setIsNextDisabled] = React.useState(true);
  // using useStates for the word count and useDraftSave to help with Redux store save
  const [storyText, setStoryText] = React.useState('');
  const [storyTitleState, setStoryTitle] = React.useState('');
  const { error, isLoading, isSaved } = useDraftSave(
    storyText,
    storyTitleState
  );
  const userWordCount = useWordCount(storyText);
  const { minWordCount, maxWordCount } = useAppSelector(
    (state) => state.adminSubmission
  );

  React.useEffect(() => {
    if (storySubmission && !storyText) {
      setStoryText(storySubmission);
    }

    if (!storyTitle && !storyTitleState) {
      setStoryTitle(storyTitle);
    }
  }, [storySubmission, storyText, storyTitle, storyTitleState]);

  React.useEffect(() => {
    if (
      storySubmissionWordCount >= 10 &&
      storySubmissionWordCount <= maxWordCount &&
      storySubmissionWordCount >= minWordCount &&
      storyTitle !== ''
    ) {
      setIsNextDisabled(false);
    } else {
      setIsNextDisabled(true);
    }
  }, [
    storyText,
    storySubmissionWordCount,
    storyTitle,
    minWordCount,
    maxWordCount,
  ]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target instanceof HTMLTextAreaElement) {
      setStoryText(e.target.value);
    } else {
      setStoryTitle(e.target.value);
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
        />
      </div>
      <div className='row'>
        <h4 className='pb-2 mt-3 ms-1'>Story</h4>
        <textarea
          autoFocus
          className='form-control ms-3'
          rows={10}
          placeholder='Enter your story here'
          value={storyText}
          onChange={handleChange}
        ></textarea>
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
