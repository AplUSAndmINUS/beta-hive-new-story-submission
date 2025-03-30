import React from 'react';
// import axios from 'axios';

import InputSelectionCard from 'src/components/form-elements/input/input-selection';
import NavigateButtons from 'src/components/navigate-buttons/navigate-buttons';

import { fetchAdminData } from 'src/stores/middleware/admin-thunks';
import { useHIVEImages } from 'src/utils/hooks/useHIVEImages';
import { useAppDispatch, useAppSelector } from 'src/stores/store';
import { setHIVE } from 'src/stores/reducers/story-submission';

export const BetaHIVESelection: React.FC = () => {
  const [isNextDisabled, setIsNextDisabled] = React.useState<boolean>(true);
  const dispatch = useAppDispatch();
  const images = useHIVEImages();
  const { minPromptSelections } = useAppSelector(
    (state) => state.adminSubmission
  );
  const { HIVE } = useAppSelector((state) => state.storySubmission);

  React.useEffect(() => {
    if (HIVE && HIVE !== '') setIsNextDisabled(false);
  }, [HIVE]);

  React.useEffect(() => {
    // try { /*** TROUBLESHOOTING STEPS lines 28-41 ***/
    //   dispatch(fetchAdminData()).then(() => {
    //     if (adminData) {
    //       console.log('Admin data fetched: ', adminData);
    //     }
    //   });
    // } catch (error) {
    //   console.error('Error fetching admin data:', error);
    //   if (axios.isAxiosError(error)) {
    //     console.error('Request config:', error.config);
    //     console.error('Response status:', error.response?.status);
    //     console.error('Response data:', error.response?.data);
    //   }
    // }
    dispatch(fetchAdminData());
  }, [dispatch]);

  const handleHIVESelection = (genre: string) => {
    // Validate that the selected genre exists in the available images
    const isValidHIVE = images.some((image) => image.name === genre);
    if (isValidHIVE) {
      dispatch(setHIVE(genre));
      setIsNextDisabled(false);
    }
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
        {images.map((image) => (
          <InputSelectionCard
            key={image.name}
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
