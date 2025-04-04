import { RootState } from 'src/stores/store';
import { getMediaUrl } from 'src/config/app-config';
import { useAppSelector } from 'src/stores/store';
import { betaHIVESchema } from 'src/services/models/betaHIVE-selection.types';

interface useHIVEImagesProps {
  isAdmin?: boolean;
  isStory?: boolean;
}

export const useHIVEImages = ({
  isAdmin = false,
  isStory = false,
}: useHIVEImagesProps) => {
  const { betaHIVEs } = useAppSelector(
    (state: RootState) => state.adminSubmission
  );
  const { availableStoryImages } = useAppSelector(
    (state: RootState) => state.storySubmission
  );

  const sourceArray = isAdmin ? betaHIVEs : isStory ? availableStoryImages : [];
  const yearMonth = isAdmin ? '2025/03' : '2025/04';

  if (isStory) {
    return sourceArray.map((item) => getMediaUrl(`${yearMonth}/${item}`));
  }

  return (sourceArray as betaHIVESchema[]).map((item) => ({
    ...item,
    imgSource: getMediaUrl(`${yearMonth}/${item.imgSource}`),
  }));
};

export default useHIVEImages;
