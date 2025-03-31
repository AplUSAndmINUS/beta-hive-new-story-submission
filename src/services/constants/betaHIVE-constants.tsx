import { betaHIVESchema } from 'src/services/models/betaHIVE-selection.types';
// import { storySchema } from 'src/services/models/battleHIVE.types';

export const BETAHIVE_SELECTIONS: betaHIVESchema[] = [
  {
    id: '1',
    name: 'Fantasy'.toLowerCase(),
    imgSource: 'fantasy.png',
    description: 'Magic, dragons, and other fantastical elements.',
  },
  {
    id: '2',
    name: 'Horror'.toLowerCase(),
    imgSource: 'horror.png',
    description: 'Scary stories that will keep you up at night.',
  },
  {
    id: '3',
    name: 'Sci-Fi'.toLowerCase(),
    imgSource: 'sci-fi.png',
    description: 'Stories set in the future or in space.',
  },
  {
    id: '4',
    name: 'Mystery'.toLowerCase(),
    imgSource: 'mystery.png',
    description: 'Puzzles and enigmas to solve.',
  },
  {
    id: '5',
    name: 'Romance'.toLowerCase(),
    imgSource: 'romance.png',
    description: 'Love stories and romantic adventures.',
  },
  {
    id: '6',
    name: 'Historical Fiction'.toLowerCase(),
    imgSource: 'non-fiction.png',
    description: 'Stories set in the past.',
  },
  {
    id: '7',
    name: 'Adventure'.toLowerCase(),
    imgSource: 'adventure.png',
    description: 'Exciting journeys and daring escapades.',
  },
  {
    id: '8',
    name: 'Suspense'.toLowerCase(),
    imgSource: 'suspense.png',
    description: 'Suspenseful and thrilling stories.',
  },
];
