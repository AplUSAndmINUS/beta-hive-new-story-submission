import React from 'react';
import moment from 'moment';

import Modal from 'src/components/modal/modal';
import NavigationButtons from 'src/components/navigate-buttons/navigate-buttons';
import InputSelectionCard from 'src/components/form-elements/input/input-selection';
import Selections from 'src/components/selections/selections';
import { useAppDispatch, useAppSelector } from 'src/stores/store';
import {
  setContentWarnings,
  setContentSensitive,
} from 'src/stores/reducers/story-submission';
import { fetchAdminData } from 'src/stores/middleware/admin-thunks';
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

  const { contentWarnings, isContentSensitive, HIVE, prompts, story, title } =
    useAppSelector((state) => state.storySubmission);

  const {
    minWordCount,
    maxWordCount,
    contentWarnings: availableWarnings,
  } = useAppSelector((state) => state.adminSubmission);

  React.useEffect(() => {
    if (!availableWarnings || availableWarnings.length === 0) {
      dispatch(fetchAdminData());
    }
  }, [dispatch, availableWarnings]);

  React.useEffect(() => {
    const errors: string[] = [];
    const wordCount = story.trim().split(/\s+/).length;

    // Validate all required fields
    if (!HIVE) {
      errors.push('HIVE selection is required');
    }
    if (!prompts || prompts.length === 0) {
      errors.push('Prompt selections are required');
    }
    if (!title) {
      errors.push('Story title is required');
    }
    if (wordCount < minWordCount) {
      errors.push(`Story must be at least ${minWordCount} words`);
    }
    if (wordCount > maxWordCount) {
      errors.push(`Story must be no more than ${maxWordCount} words`);
    }

    // Content warning validation
    if (isContentSensitive && contentWarnings.length === 0) {
      errors.push('Please select at least one content warning');
    } else if (
      isContentSensitive &&
      contentWarnings.length > MAX_CONTENT_WARNINGS
    ) {
      errors.push(`Maximum ${MAX_CONTENT_WARNINGS} content warnings allowed`);
    }

    setValidationErrors(errors);
    setIsSubmitDisabled(errors.length > 0);
  }, [
    HIVE,
    prompts,
    story,
    title,
    isContentSensitive,
    contentWarnings.length,
    minWordCount,
    maxWordCount,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const storyData = {
      title,
      story,
      author: 'Author ID', // This should come from user authentication
      HIVE,
      prompts,
      isContentSensitive,
      contentWarnings,
      battleName: 'Battle of the HIVEs', // This should come from admin settings
      wordCount: story.trim().split(/\s+/).length,
      characterCount: story.length,
      status: 'Draft' as const,
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
    dispatch(setContentSensitive(label === 'Yes'));
    if (label === 'No') {
      dispatch(setContentWarnings([]));
    }
  };

  const handleContentSensitivities = (
    contentName: string,
    isChecked?: boolean
  ) => {
    if (isContentSensitive) {
      const currentWarnings = new Set(contentWarnings);

      if (isChecked) {
        if (currentWarnings.has(contentName)) {
          currentWarnings.delete(contentName);
        } else if (currentWarnings.size < MAX_CONTENT_WARNINGS) {
          currentWarnings.add(contentName);
        }
      } else {
        currentWarnings.delete(contentName);
      }

      dispatch(setContentWarnings(Array.from(currentWarnings)));
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
      <div className={`row mt-5 ${!isContentSensitive && 'opacity-25'}`}>
        <h3 className='pb-2 mt-5'>
          Content Sensitivities
          {isContentSensitive && (
            <small className='text-muted ms-2'>
              (Select up to {MAX_CONTENT_WARNINGS})
            </small>
          )}
        </h3>
        {availableWarnings.map((warning, index) => (
          <InputSelectionCard
            key={warning.id || index}
            name={warning.name}
            inputType='checkbox'
            isDisabled={
              !isContentSensitive ||
              (contentWarnings.length >= MAX_CONTENT_WARNINGS &&
                !contentWarnings.includes(warning.name))
            }
            label={warning.name}
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
