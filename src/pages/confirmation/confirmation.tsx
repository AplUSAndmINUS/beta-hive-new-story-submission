import React from 'react';
import { useAppSelector } from 'src/stores/store';
import Selections from 'src/components/selections/selections';

const Confirmation: React.FC = () => {
  const { title, story, HIVE, prompts, isContentSensitive, contentWarnings } =
    useAppSelector((state) => state.storySubmission);

  return (
    <div className='container-fluid'>
      <div className='row d-flex justify-content-between align-items-center'>
        <div className='col'>
          <h1 className='bd-title pb-2 mt-4'>Story Submission Confirmation</h1>
          <p className='text-muted pb-2 mt-2 fs-5'>
            Please review your story details before final submission.
          </p>
        </div>
        <Selections />
      </div>
      <div className='row mt-4'>
        <div className='col-md-8'>
          <h3>Story Title</h3>
          <p>{title}</p>
        </div>
        <div className='col-md-4'>
          <h3>HIVE</h3>
          <p>{HIVE}</p>
        </div>
      </div>
      <div className='row mt-4'>
        <div className='col-12'>
          <h3>Prompts</h3>
          <ul>
            {prompts.map((prompt, index) => (
              <li key={index}>{prompt}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className='row mt-4'>
        <div className='col-12'>
          <h3>Content Warnings</h3>
          <p>{isContentSensitive ? 'Yes' : 'No'}</p>
          {isContentSensitive && contentWarnings.length > 0 && (
            <ul>
              {contentWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className='row mt-4'>
        <div className='col-12'>
          <h3>Story Preview</h3>
          <div className='border p-3 bg-light'>
            <p>{story}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
