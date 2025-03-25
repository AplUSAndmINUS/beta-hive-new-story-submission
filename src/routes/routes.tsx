
import { NonIndexRouteObject } from 'react-router-dom';

import BetaHIVESelection from 'src/pages/betaHIVE-selection/betaHIVE-selection';
import PromptSelection from 'src/pages/prompt-selection/prompt-selection';
import StorySubmission from 'src/pages/story-submission/story-submission';
import ContentWarnings from 'src/pages/content-warnings/content-warnings';
import Confirmation from 'src/pages/confirmation/confirmation';
import NotFound from 'src/pages/404/404';

export interface Routes extends NonIndexRouteObject {
  name: string;
  storySubmission?: boolean;
}

export const storyRoutes: Routes[] = [
  {
    path: '/BetaHIVE-selection',
    name: 'Beta HIVE Selection',
    element: <BetaHIVESelection />,
    storySubmission: true,
  },
  {
    path: '/prompt-selection',
    name: 'Prompt Selection',
    element: <PromptSelection />,
    storySubmission: true,
  },
  {
    path: '/story-submission',
    name: 'Story Submission',
    element: <StorySubmission />,
    storySubmission: true,
  },
  {
    path: '/content-warning',
    name: 'Content Warning',
    element: <ContentWarnings />,
    storySubmission: true,
  },
  {
    path: '/confirmation',
    name: 'Confirmation',
    element: <Confirmation />,
    storySubmission: true,
  },
  {
    path: '*',
    name: 'Not Found',
    element: <NotFound />,
  },
];
