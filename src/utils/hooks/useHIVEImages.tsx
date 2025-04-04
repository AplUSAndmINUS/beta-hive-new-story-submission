import { RootState } from 'src/stores/store';
import { getMediaUrl } from 'src/config/app-config';
import { useAppSelector } from 'src/stores/store';

export interface StoryImage {
  imgSource: string;
}

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
  const {
    system: { storyImages },
  } = useAppSelector((state: RootState) => state.storySubmission);

  const sourceArray = isAdmin ? betaHIVEs : isStory ? storyImages : [];
  const yearMonth = isAdmin ? '2025/03' : '2025/04'; // hardcoded month and year URL from WP's Media Library

  return sourceArray.map((item) => ({
    ...item,
    imgSource: getMediaUrl(`${yearMonth}/${item.imgSource}`),
  }));
};

export default useHIVEImages;
