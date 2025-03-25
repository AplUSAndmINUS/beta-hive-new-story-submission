import useSetPercentage from './useSetPercentage';

export const useProgressText = () => {
  const percentage = useSetPercentage();

  switch (percentage) {
    case 20:
      return 'Step 1 of 5: Genre Selection';
    case 40:
      return 'Step 2 of 5: Prompt Selection';
    case 60:
      return 'Step 3 of 5: Story Submission';
    case 80:
      return 'Step 4 of 5: Content Warnings';
    case 100:
      return 'Step 4 of 5: Confirmation';
    default:
      return 'Step 1 of 5: Genre Selection';
  }
};

export default useProgressText;
