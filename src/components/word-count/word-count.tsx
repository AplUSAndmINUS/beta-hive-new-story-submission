import React from 'react';

interface WordCountProps {
  wordCount: React.ReactNode;
}

export const WordCount: React.FC<WordCountProps> = ({ wordCount }) => {
  return (
    <div className='mt-3'>
      <p>
        <span className='fw-bold'>{wordCount}</span>
      </p>
    </div>
  );
};

export default WordCount;