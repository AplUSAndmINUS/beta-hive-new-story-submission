import { useSelector } from 'react-redux';
import { RootState } from 'src/stores/store';
import { getMediaUrl } from 'src/config/app-config';

interface HIVE {
  name: string;
  description: string;
  imgSource: string;
}

export const useHIVEImages = () => {
  const { betaHIVEs } = useSelector(
    (state: RootState) => state.adminSubmission
  );

  return betaHIVEs.map((hive: HIVE) => ({
    ...hive,
    imgSource: getMediaUrl(`2025/03/${hive.imgSource}.png`),
  }));
};

export default useHIVEImages;
