import React from 'react';

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

  const {
    isContentSensitive,
    system: { HIVE, prompts, contentWarnings },
    story,
    title,
    isShared,
  } = useAppSelector((state) => state.storySubmission);

  const {
    minWordCount,
    maxWordCount,
    contentWarnings: availableWarnings,
    battleName,
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
    if (isContentSensitive === undefined) {
      errors.push(
        'Please select whether your story contains sensitive content.'
      );
    } else if (isContentSensitive && contentWarnings.length === 0) {
      errors.push('Please select at least one content warning.');
    } else if (contentWarnings.length > MAX_CONTENT_WARNINGS) {
      errors.push(
        `You can only select up to ${MAX_CONTENT_WARNINGS} content warnings.`
      );
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
      // User-editable fields
      title,
      story,
      author: 'current_user_id', // This should come from user authentication
      isContentSensitive,
      isShared,

      // System-controlled fields (protected from user modification)
      system: {
        HIVE,
        prompts,
        battleName,
        contentWarnings: contentWarnings as string[],
        wordCount: story.trim().split(/\s+/).length,
        characterCount: story.length,
        status: 'Draft' as const,
        lastModified: new Date().toISOString(),
        modifiedBy: 'system' as const,
        version: 1,
        tags: [], // Tags can only be modified by admin
        metadata: {
          isUserEditable: false,
          lastAdminUpdate: null,
          adminId: null,
        },
        feedback: [], // Initialize empty feedback array
        wins: 0, // Initialize wins count
        losses: 0, // Initialize losses count
      },
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

  const handleContentSensitivities = (warning: string) => {
    if (contentWarnings.includes(warning)) {
      dispatch(
        setContentWarnings(contentWarnings.filter((w) => w !== warning))
      );
    } else {
      dispatch(setContentWarnings([...contentWarnings, warning]));
    }
  };

  const handleNextClick = () => {
    const errors: string[] = [];
    if (isContentSensitive === undefined) {
      errors.push(
        'Please select whether your story contains sensitive content.'
      );
    } else if (isContentSensitive && contentWarnings.length === 0) {
      errors.push('Please select at least one content warning.');
    } else if (contentWarnings.length > MAX_CONTENT_WARNINGS) {
      errors.push(
        `You can only select up to ${MAX_CONTENT_WARNINGS} content warnings.`
      );
    }
    setValidationErrors(errors);
    setIsSubmitDisabled(errors.length > 0);
    setShowModal(true);
  };

  return (
    <>
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
        <div className='row mt-5'>
          <h3 className='pb-2 mt-5'>Content Sensitivity</h3>
          <div className='d-flex flex-row justify-content-between align-items-center'>
            <InputSelectionCard
              name='contentSensitive'
              inputType='radio'
              label='Yes'
              handleSelection={handleContentWarningRadio}
              isDisabled={false}
            />
            <InputSelectionCard
              name='contentSensitive'
              inputType='radio'
              label='No'
              handleSelection={handleContentWarningRadio}
              isDisabled={false}
            />
          </div>
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
                : '(You can edit your story and content warnings after submission.)'
            }
            isConfirmation={!isErrorModal}
            onConfirm={() => {
              const formEvent = new Event(
                'submit'
              ) as unknown as React.FormEvent;
              handleSubmit(formEvent);
            }}
            onDismiss={() => {
              setShowModal(false);
              setIsErrorModal(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default ContentWarnings;
