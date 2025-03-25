import React from 'react';

import InputSelectionCard from 'src/components/form-elements/input/input-selection';
import NavigateButtons from 'src/components/navigate-buttons/navigate-buttons';

import { useHIVEImages } from 'src/utils/hooks/useHIVEImages';
import { useAppDispatch, useAppSelector } from 'src/stores/store';
import { setBetaHIVESelection } from 'src/stores/reducers/story-submission';

export const BetaHIVESelection: React.FC = () => {
  const [isNextDisabled, setIsNextDisabled] = React.useState<boolean>(true);
  const dispatch = useAppDispatch();
  const images = useHIVEImages();
  const { minPromptSelections } = useAppSelector(
    (state) => state.adminSubmission
  );
  const { betaHIVESelection } = useAppSelector(
    (state) => state.storySubmission
  );

  React.useEffect(() => {
    if (betaHIVESelection
      && betaHIVESelection !== '')
      setIsNextDisabled(false);
  }, [betaHIVESelection]);

  const handleHIVESelection = (genre: string) => {
    dispatch(setBetaHIVESelection(genre));
    setIsNextDisabled(false);
  };

  const getPlural = () =>
    `${minPromptSelections} random prompt${minPromptSelections > 1 ? 's' : ''}`;

  return (
    <div className='container-fluid'>
      <div className='row'>
        <h1 className='bd-title pb-2 mt-4'>Story Submission</h1>
        <p className='text-muted pb-2 mt-2 fs-5'>
          This page will guide you on submitting your story and selecting your
          HIVE (team and genre).
          <br />
          Follow the prompts on each step to create a story based on{' '}
          {getPlural()}.<br />
          You can change your selections at any time by clicking on the pencil
          icon next to the selection.
        </p>
      </div>
      <div className='row'>
        <h1 className='bd-title pb-2 mt-4'>Choose your HIVE</h1>
      </div>
      <div className='row'>
        {images.map((image, index) => (
          <InputSelectionCard
            key={index}
            handleSelection={handleHIVESelection}
            isDisabled={false}
            name={image.name}
            label={image.name}
            inputType='radio'
            imgSource={image.imgSource}
            description={image.description}
            isBetaHIVE
          />
        ))}
      </div>
      <NavigateButtons
        isBackDisplayed={false}
        isNextDisabled={isNextDisabled}
        nextNavigation='Prompt Selection'
        nextButtonText='Next'
      />
    </div>
  );
};

export default BetaHIVESelection;
