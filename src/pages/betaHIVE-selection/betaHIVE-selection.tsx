import React from 'react';

import { useAppDispatch, useAppSelector } from 'src/stores/store';
import { setBetaHIVESelection } from 'src/stores/reducers/story-submission';
import { useHIVEImages } from 'src/utils/hooks/useHIVEImages';
import HIVEGenreSquare from 'src/components/hive-genre/hive-genre-square';
import useNavigation from 'src/utils/hooks/useNavigation';

export const BetaHIVESelection: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigation();
  const images = useHIVEImages();
  const { betaHIVEs } = useAppSelector((state) => state.adminSubmission);

  const handlebetaHIVESelection = (genre: string) => {
    dispatch(setBetaHIVESelection(genre));
    navigate('Prompt Selection');
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <h1 className='bd-title pb-2 mt-4'>Choose your HIVE</h1>
      </div>
      <div className='row'>
        {images.map((image, index) => (
          <HIVEGenreSquare
            key={image.name + index}
            imgFluid
            imageName={image.name.toLowerCase()}
            imageURL={image.imgSource}
            setbetaHIVESelection={handlebetaHIVESelection}
          />
        ))}
      </div>
    </div>
  );
};

export default BetaHIVESelection;
