import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUser } from '../../services/user.service';
import { User } from '../../types/user';

export interface CommonState {
  user: Option<User>;
  loading: boolean;
}

const initialState: CommonState = {
  user: None,
  loading: true,
};

const slice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    loadUser: (state, { payload: user }: PayloadAction<User>) => {
      user.token && localStorage.setItem('token', user.token);
      state.user = Some(user);
      state.loading = false;
    },
    logout: (state) => {
      state.user = None;
      localStorage.removeItem('token');
      location.href = '/';
    },
    endLoad: (state) => {
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // get current user
      .addCase(getUser.fulfilled, (state, { payload: user }) => {
        state.user = Some(user);
        state.loading = false;
      })
      .addCase(getUser.rejected, (state) => {
        localStorage.removeItem('token');
        state.loading = false;
      });
  },
});

export const { loadUser, logout, endLoad } = slice.actions;

export default slice.reducer;
