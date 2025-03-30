import React from 'react';
import { useAppSelector } from 'src/stores/store';
import { getAssetPath } from 'src/config/app-config';

interface Image {
  name: string;
  imgSource: string;
  description: string;
}

export const useHIVEImages = () => {
  const betaHIVEs = useAppSelector((state) => state.adminSubmission.betaHIVEs);
  const [images, setImages] = React.useState<Image[]>([]);

  React.useEffect(() => {
    const imageArray: Image[] = betaHIVEs.map((hive) => ({
      name: hive.name,
      description: hive.description,
      imgSource: getAssetPath(`images/${hive.imgSource}`),
    }));

    setImages(imageArray);
  }, [betaHIVEs]);

  return images;
};

export default useHIVEImages;
