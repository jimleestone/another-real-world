import { createAsyncThunk } from '@reduxjs/toolkit';
import { object } from 'decoders';
import { Profile, profileDecoder } from '../types/profile';
import { get, post, remove } from './api-service';

export const getProfile = createAsyncThunk<Profile, string>('getProfile', async (username, { rejectWithValue }) => {
  const result = await get<{ profile: Profile }>(`/profiles/${username}`, object({ profile: profileDecoder }));
  return result.isOk() ? result.ok().unwrap().profile : rejectWithValue(result.err().unwrap());
});

export const follow = createAsyncThunk<Profile, string>('follow', async (username, { rejectWithValue }) => {
  const result = await post<{ profile: Profile }>(
    `/profiles/${username}/follow`,
    undefined,
    object({ profile: profileDecoder })
  );
  return result.isOk() ? result.ok().unwrap().profile : rejectWithValue(result.err().unwrap());
});

export const unFollow = createAsyncThunk<Profile, string>('unFollow', async (username, { rejectWithValue }) => {
  const result = await remove<{ profile: Profile }>(
    `/profiles/${username}/follow`,
    object({ profile: profileDecoder })
  );
  return result.isOk() ? result.ok().unwrap().profile : rejectWithValue(result.err().unwrap());
});
