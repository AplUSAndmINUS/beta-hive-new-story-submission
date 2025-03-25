import React from 'react';

import { useAppSelector } from 'src/stores/store';

interface Image {
  name: string;
  imgSource: string;
}

export const useHIVEImages = () => {
  const betaHIVEs = useAppSelector((state) => state.adminSubmission.betaHIVEs);
  const [images, setImages] = React.useState<Image[]>([]);

  React.useEffect(() => {
    const context = (require as any).context(
      '../../assets/images',
      false,
      /\.png$/
    );

    const imageMap: { [key: string]: string } = {};
    context.keys().forEach((key: string) => {
      const name = key.replace('./', '').replace('.png', '');
      imageMap[name] = context(key);
    });

    const imageArray: Image[] = betaHIVEs.map((hive) => ({
      name: hive.name,
      imgSource: imageMap[hive.imgSource.replace('.png', '')] || '',
    }));

    setImages(imageArray);
  }, [betaHIVEs]);

  return images;
};

export default useHIVEImages;
