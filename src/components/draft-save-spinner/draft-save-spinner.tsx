import React from 'react';

interface SaveSpinnerProps {
  error?: string | null;
  innerText?: string;
  isLoading: boolean;
  isPageLoading?: boolean;
  isSaved: boolean;
  savedText?: string;
}

export const SaveSpinner: React.FC<SaveSpinnerProps> = ({
  error,
  innerText,
  isLoading,
  isPageLoading,
  isSaved,
  savedText,
}) => {
  return (
    <div className='d-flex justify-content-flex-end ms-3'>
      {isPageLoading && (
        <div className='d-flex align-items-center'>
          <div
            className='spinner-border text-primary mt-4 mb-2 me-2'
            role='status'
          />
          <p className='mt-4 me-3 fw-bold'>Please wait...</p>
        </div>
      )}
      {!isPageLoading && isLoading && (
        <div className='d-flex align-items-center'>
          <div
            className='spinner-border text-primary mt-4 mb-2 me-2'
            role='status'
          />
          <p className='mt-4 me-3'>{innerText || 'Saving your draft...'}</p>
        </div>
      )}
      {!isPageLoading && !isLoading && !error && isSaved && (
        <p className='mt-4 me-3 fw-bold'>{savedText || 'Draft saved!'}</p>
      )}
      {!isPageLoading && !isLoading && error && (
        <p className='mt-4 me-3 text-danger'>{error}</p>
      )}
    </div>
  );
};

export default SaveSpinner;
