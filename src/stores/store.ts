import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';

import adminSubmissionReducer from './reducers/admin-submission';
import storySubmissionReducer from './reducers/story-submission';

export const store = configureStore({
  reducer: {
    adminSubmission: adminSubmissionReducer,
    storySubmission: storySubmissionReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;