import { createAsyncThunk } from '@reduxjs/toolkit';
import { get } from './api-service';

export const getTags = createAsyncThunk<{ tags: string[] }>('getTags', async (_, { rejectWithValue }) => {
  const result = await get<{ tags: string[] }>('/tags');
  return result.isOk() ? result.ok().unwrap() : rejectWithValue(result.err().unwrap());
});
