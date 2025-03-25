import React from 'react';
import { useLocation as location } from 'react-router-dom';

export const useSetPercentage = () => {
  const [percentage, setPercentage] = React.useState(20);
  const path = location().pathname;

  const handleSetPercentage = (percentage: number) => {
    setPercentage(percentage);
  };

  React.useEffect(() => {
    switch (path) {
      case '/':
        handleSetPercentage(20);
        break;
      case '/genre-selection':
        handleSetPercentage(20);
        break;
      case '/prompt-selection':
        handleSetPercentage(40);
        break;
      case '/story-submission':
        handleSetPercentage(60);
        break;
      case '/content-warning':
        handleSetPercentage(80);
        break;
      case '/confirmation':
        handleSetPercentage(100);
        break;
      default:
        handleSetPercentage(20);
        break;
    }
  }, [path]);

  return percentage;
};

export default useSetPercentage;
