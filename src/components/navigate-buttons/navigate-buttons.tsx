import React from 'react';

import useNavigation from 'src/utils/hooks/useNavigation';

interface NavigateButtonsProps {
  backNavigation?: string;
  handleSubmit?: (e: React.FormEvent) => void;
  isBackDisplayed?: boolean;
  isGoBack?: boolean;
  isNextDisabled: boolean;
  isNextDisplayed?: boolean;
  isStorySubmission?: boolean;
  isSubmitDisabled?: boolean;
  isSubmitDisplayed?: boolean;
  nextButtonText?: string;
  nextNavigation?: string;
}

export const NavigateButtons: React.FC<NavigateButtonsProps> = ({
  backNavigation,
  handleSubmit,
  isBackDisplayed = true,
  isGoBack = false,
  isNextDisabled,
  isNextDisplayed = true,
  isStorySubmission = false,
  isSubmitDisabled = true,
  isSubmitDisplayed = false,
  nextButtonText = 'Next',
  nextNavigation,
}) => {
  const navigate = useNavigation();

  return (
    <div className='d-flex justify-content-flex-start'>
      {isBackDisplayed && backNavigation && (
        <button
          className={`btn btn-outline-primary mr-4 ${
            !isStorySubmission && 'mt-4'
          }`}
          onClick={
            isGoBack
              ? () => window.history.back()
              : () => navigate(backNavigation)
          }
        >
          Go Back
        </button>
      )}
      &nbsp;&nbsp;
      {isNextDisplayed && nextNavigation && (
        <button
          className={`btn btn-primary ${!isStorySubmission && 'mt-4'}`}
          disabled={isNextDisabled}
          onClick={() => navigate(nextNavigation)}
        >
          {nextButtonText}
        </button>
      )}
      {isSubmitDisplayed && (
        <button
          className={`btn btn-primary ${!isStorySubmission && 'mt-4'}`}
          type='submit'
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default NavigateButtons;
