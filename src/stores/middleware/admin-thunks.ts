import { createAsyncThunk } from '@reduxjs/toolkit';

import { getAllGameContent } from 'src/services/apis/admin-apis';
import { gameSettingsSchema } from 'src/services/models/betaHIVE-selection.types';

export const fetchAdminData = createAsyncThunk<
  gameSettingsSchema,
  void,
  { rejectValue: string }
>('admin/fetchAdminData', async (_, { rejectWithValue }) => {
  try {
    const response = await getAllGameContent();
    if (!response) {
      throw new Error('No admin data received');
    }
    return response;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});