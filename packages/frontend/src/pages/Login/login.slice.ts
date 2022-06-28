import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login } from '../../services/user.service';
import { GenericErrors } from '../../types/error';

export interface LoginState {
  user: {
    email: string;
    password: string;
  };
  errors: GenericErrors;
  loggingIn: boolean;
}

const initialState: LoginState = {
  user: {
    email: '',
    password: '',
  },
  errors: {},
  loggingIn: false,
};

const slice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    initializeLogin: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof LoginState['user']; value: string }>
    ) => {
      state.user[name] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loggingIn = true;
      })
      .addCase(login.fulfilled, (state) => {
        state.loggingIn = false;
        location.href = '/';
      })
      .addCase(login.rejected, (state, { payload: errors }) => {
        if (errors) state.errors = errors;
        state.loggingIn = false;
      });
  },
});

export const { initializeLogin, updateField } = slice.actions;

export default slice.reducer;
