import { RootState } from 'src/stores/store';
import { getMediaUrl } from 'src/config/app-config';
import { useAppSelector } from 'src/stores/store';

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
  const yearMonth = isAdmin ? '2025/03' : '2025/04'; // hardcoded month and year URL from WP's Media Library

  return sourceArray.map((item) => ({
    imgSource: getMediaUrl(
      `${yearMonth}/${typeof item === 'string' ? item : item.imgSource}`
    ),
  }));
};

export default useHIVEImages;
