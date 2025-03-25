import React from 'react';
import { useAppSelector } from 'src/stores/store';

export const useWordCount = (story: string) => {
  const [userWordCount, setWordCount] = React.useState(0);
  const { minWordCount, maxWordCount } = useAppSelector(
    (state) => state.adminSubmission
  );

  React.useEffect(() => {
    if (story) {
      setWordCount(story.split(' ').length - 1);
    }
  }, [story]);

  const isOutOfBounds =
    userWordCount < minWordCount || userWordCount > maxWordCount;

  return (
    <>
      <span>Story word count: </span>
      <span className={isOutOfBounds ? 'text-warning' : 'text-success'}>
        {userWordCount}
      </span>
      {' / '}
      {maxWordCount || 1000}
      <br />
      <span className={isOutOfBounds ? 'text-warning' : ''}>
        Minimum word count: {minWordCount}
      </span>
    </>
  );
};

export default useWordCount;
