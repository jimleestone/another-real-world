import { createAsyncThunk } from '@reduxjs/toolkit';
import { loadUser } from '../store/common/common.slice';
import { GenericErrors } from '../types/error';
import { User, UserForLogin, UserForRegistration, UserSettings } from '../types/user';
import { get, post, put } from './api-service';

export const getUser = createAsyncThunk<User>('getUser', async (_, { rejectWithValue }) => {
  const result = await get<{ user: User }>('/user');
  return result.isOk() ? result.ok().unwrap().user : rejectWithValue(result.err().unwrap());
});

export const login = createAsyncThunk<User, UserForLogin, { rejectValue: GenericErrors }>(
  'login',
  async (user, { dispatch, rejectWithValue }) => {
    const result = await post<{ user: User }>('/users/login', { user });
    if (result.isOk()) {
      const loginUser = result.ok().unwrap().user;
      dispatch(loadUser(loginUser));
      return loginUser;
    }
    return rejectWithValue(result.err().unwrap());
  }
);

export const register = createAsyncThunk<User, UserForRegistration, { rejectValue: GenericErrors }>(
  'register',
  async (user, { dispatch, rejectWithValue }) => {
    const result = await post<{ user: User }>('/users', { user });
    if (result.isOk()) {
      const registerUser = result.ok().unwrap().user;
      dispatch(loadUser(registerUser));
      return registerUser;
    }
    return rejectWithValue(result.err().unwrap());
  }
);

export const updateUser = createAsyncThunk<User, UserSettings, { rejectValue: GenericErrors }>(
  'updateUser',
  async (user, { dispatch, rejectWithValue }) => {
    const result = await put<{ user: User }>('/user', { user });
    if (result.isOk()) {
      const userSettings = result.ok().unwrap().user;
      dispatch(loadUser(userSettings));
      return userSettings;
    }
    return rejectWithValue(result.err().unwrap());
  }
);
