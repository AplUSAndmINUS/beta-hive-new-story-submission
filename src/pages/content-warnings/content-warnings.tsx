import React from 'react';
import moment from 'moment';

import Modal from 'src/components/modal/modal';
import NavigationButtons from 'src/components/navigate-buttons/navigate-buttons';
import InputSelectionCard from 'src/components/form-elements/input/input-selection';
import Selections from 'src/components/selections/selections';
import { useAppDispatch, useAppSelector } from 'src/stores/store';
import {
  setContentSensitivities,
  setIsContentWarning,
} from 'src/stores/reducers/story-submission';
import { CONTENT_WARNINGS } from 'src/services/constants/admin-constants';
import useNavigation from 'src/utils/hooks/useNavigation';
import { addStory } from 'src/services/apis/stories-apis';

const MAX_CONTENT_WARNINGS = 4;

export const ContentWarnings: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [showModal, setShowModal] = React.useState(false);
  const [isErrorModal, setIsErrorModal] = React.useState(false);

  const {
    contentSensitivities,
    contentWarning,
    betaHIVESelection,
    promptSelections,
    storySubmission,
    storyTitle,
  } = useAppSelector((state) => state.storySubmission);

  const { minWordCount, maxWordCount } = useAppSelector(
    (state) => state.adminSubmission
  );

  React.useEffect(() => {
    const errors: string[] = [];
    const wordCount = storySubmission.trim().split(/\s+/).length;

    // Validate all required fields
    if (!betaHIVESelection) {
      errors.push('HIVE selection is required');
    }
    if (!promptSelections || promptSelections.length === 0) {
      errors.push('Prompt selections are required');
    }
    if (!storyTitle) {
      errors.push('Story title is required');
    }
    if (wordCount < minWordCount) {
      errors.push(`Story must be at least ${minWordCount} words`);
    }
    if (wordCount > maxWordCount) {
      errors.push(`Story must be no more than ${maxWordCount} words`);
    }

    // Content warning validation
    if (!contentWarning) {
      errors.push('Please specify if your story has content warnings');
    } else if (contentWarning === 'Yes' && contentSensitivities.length === 0) {
      errors.push('Please select at least one content warning');
    } else if (
      contentWarning === 'Yes' &&
      contentSensitivities.length > MAX_CONTENT_WARNINGS
    ) {
      errors.push(`Maximum ${MAX_CONTENT_WARNINGS} content warnings allowed`);
    }

    setValidationErrors(errors);
    setIsSubmitDisabled(errors.length > 0);
  }, [
    betaHIVESelection,
    promptSelections,
    storySubmission,
    storyTitle,
    contentWarning,
    contentSensitivities.length,
    minWordCount,
    maxWordCount,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const storyData = {
      title: storyTitle,
      story: storySubmission,
      author: 'Author ID', // This should come from user authentication
      HIVE: betaHIVESelection,
      prompts: promptSelections,
      isContentSensitive: contentWarning === 'Yes',
      contentWarnings: contentSensitivities,
      battleName: 'Battle of the HIVEs', // This should come from admin settings
      wordCount: storySubmission.trim().split(/\s+/).length,
      status: 'draft',
    };

    try {
      await addStory(storyData);
      navigate('Confirmation');
    } catch (error) {
      console.error('Error submitting story:', error);
      setValidationErrors([
        ...validationErrors,
        'Failed to submit story. Please try again.',
      ]);
      setIsErrorModal(true);
      setShowModal(true);
    }
  };

  const handleContentWarningRadio = (label: string) => {
    dispatch(setIsContentWarning(label));
    if (label === 'No') {
      dispatch(setContentSensitivities([]));
    }
  };

  const handleContentSensitivities = (
    contentName: string,
    isChecked?: boolean
  ) => {
    if (contentWarning === 'Yes') {
      const currentSensitivities = new Set(contentSensitivities);

      if (isChecked) {
        if (currentSensitivities.has(contentName)) {
          currentSensitivities.delete(contentName);
        } else if (currentSensitivities.size < MAX_CONTENT_WARNINGS) {
          currentSensitivities.add(contentName);
        }
      } else {
        currentSensitivities.delete(contentName);
      }

      dispatch(setContentSensitivities(Array.from(currentSensitivities)));
    }
  };

  const handleNextClick = () => {
    if (validationErrors.length > 0) {
      setIsErrorModal(true);
      setShowModal(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row d-flex justify-content-between align-items-center'>
        <div className='col'>
          <h1 className='bd-title pb-2 mt-4'>Content warnings</h1>
          <p className='text-muted pb-2 mt-2 fs-5'>
            Specify if your story will include any sensitive content or
            objectionable material.
            <br />
            These are used to allow readers to filter stories based on their
            preferences.
          </p>
        </div>
        <Selections />
      </div>
      <div className='row'>
        <h3 className='pb-2 mt-5'>
          Will your story have any content sensitive to certain groups?
        </h3>
        <InputSelectionCard
          name='isContentSensitive'
          isDisabled={false}
          inputType='radio'
          label='Yes'
          handleSelection={handleContentWarningRadio}
        />
        <InputSelectionCard
          name='isContentSensitive'
          isDisabled={false}
          inputType='radio'
          label='No'
          handleSelection={handleContentWarningRadio}
        />
      </div>
      <div className={`row mt-5 ${contentWarning !== 'Yes' && 'opacity-25'}`}>
        <h3 className='pb-2 mt-5'>
          Content Sensitivities
          {contentWarning === 'Yes' && (
            <small className='text-muted ms-2'>
              (Select up to {MAX_CONTENT_WARNINGS})
            </small>
          )}
        </h3>
        {CONTENT_WARNINGS.map((content, index) => (
          <InputSelectionCard
            key={content.name + index}
            name={content.name}
            inputType='checkbox'
            isDisabled={
              contentWarning !== 'Yes' ||
              (contentSensitivities.length >= MAX_CONTENT_WARNINGS &&
                !contentSensitivities.includes(content.name))
            }
            label={content.name}
            handleSelection={handleContentSensitivities}
          />
        ))}
      </div>
      <NavigationButtons
        backNavigation='Story Submission'
        handleSubmit={handleNextClick}
        isNextDisabled={true}
        isNextDisplayed={false}
        isSubmitDisabled={isSubmitDisabled}
        isSubmitDisplayed={true}
      />
      {showModal && (
        <Modal
          alertMessage={
            isErrorModal
              ? validationErrors[0]
              : 'Are you sure you want to submit your story? Once you submit, you cannot change your HIVE selection.'
          }
          alertMessage2={
            isErrorModal
              ? undefined
              : '(You can edit your story after submission.)'
          }
          isConfirmation={!isErrorModal}
          onConfirm={() => {
            const formEvent = new Event('submit') as unknown as React.FormEvent;
            handleSubmit(formEvent);
          }}
          onDismiss={() => {
            setShowModal(false);
            setIsErrorModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ContentWarnings;
