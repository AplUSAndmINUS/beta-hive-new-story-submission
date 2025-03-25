import React from 'react';
import { Link } from 'react-router-dom';

import { routes } from '../../../../../src/routes/routes';
import { useAppSelector } from '../../../../../src/stores/store';

interface SelectionsProps {
  isStoryView?: boolean;
}

export const Selections: React.FC<SelectionsProps> = ({
  isStoryView = false,
}) => {
  const { minWordCount, maxWordCount } = useAppSelector(
    (state) => state.adminSubmission
  );
  const {
    betaHIVESelection,
    promptSelections,
    storySubmission,
    storySubmissionWordCount,
    storyTitle,
    contentSensitivities,
  } = useAppSelector((state) => state.storySubmission);

  return isStoryView ? (
    <div className='container ml-auto text-start w-100'>
      <div className='row d-flex justify-content-start align-items-center'>
        <div className='pt-0 pb-0'>
          <p>
            <strong>Prompts: </strong> {promptSelections || 'None selected'}{' '}
          </p>
        </div>
        <div className='pb-0'>
          <p className='text-right'>
            <strong>Content Warnings: </strong>
            {contentSensitivities || 'None selected'}{' '}
            {!isStoryView && <i className='fas fa-pencil-alt' />}
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className='container'>
      <div className='row d-flex justify-content-flex-start align-items-center w-50 p-0 mx-0 mb-3 text-start'>
        <Link
          to={
            routes.filter((route) => route.name === 'Beta HIVE Selection')[0]
              .path || '/'
          }
          className='text-decoration-none custom-link'
          style={{ paddingLeft: 0 }}
        >
          <div className='pt-3 pb-0'>
            <p className='text-right'>
              <strong>Beta HIVE: </strong>
              <span className={`${!betaHIVESelection && 'text-warning'}`}>
                {betaHIVESelection || 'None selected'}{' '}
              </span>
              <i className='fas fa-pencil-alt' />
            </p>
          </div>
        </Link>

        <Link
          to={
            routes.filter((route) => route.name === 'Prompt Selection')[0]
              ?.path || '/'
          }
          className='text-decoration-none custom-link'
          style={{ paddingLeft: 0 }}
        >
          <div className='pt-0 pb-0'>
            <p className='text-right'>
              <strong>Prompts: </strong>{' '}
              <span
                className={`${promptSelections.length < 1 && 'text-warning'}`}
              >
                {promptSelections.join(', ') || 'None selected'}{' '}
              </span>
              <i className='fas fa-pencil-alt' />
            </p>
          </div>
        </Link>
        <Link
          to={
            routes.filter((route) => route.name === 'Story Submission')[0]
              .path || '/'
          }
          className='text-decoration-none custom-link'
          style={{ paddingLeft: 0 }}
        >
          <div className='pt-0 pb-0'>
            <p className='text-right'>
              <strong>Story Submission: </strong>{' '}
              <span className={`${!storySubmission && 'text-warning'}`}>
                {storySubmission && storyTitle
                  ? storySubmissionWordCount <= maxWordCount &&
                    storySubmissionWordCount >= minWordCount
                    ? 'Submitted'
                    : 'In progress'
                  : 'Not submitted'}{' '}
              </span>
              <i className='fas fa-pencil-alt' />
            </p>
          </div>
        </Link>
        <Link
          to={
            routes.filter((route) => route.name === 'Content Warning')[0]
              ?.path || '/'
          }
          className='text-decoration-none custom-link'
          style={{ paddingLeft: 0 }}
        >
          <div className='pt-0 pb-0'>
            <p className='text-right'>
              <strong>Content Warnings: </strong>{' '}
              <span
                className={`${
                  contentSensitivities.length < 1 && 'text-warning'
                }`}
              >
                {contentSensitivities.join(', ') || 'None selected'}{' '}
              </span>
              <i className='fas fa-pencil-alt' />
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Selections;
