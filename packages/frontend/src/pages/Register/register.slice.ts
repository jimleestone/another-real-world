import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { register } from '../../services/user.service';
import { GenericErrors } from '../../types/error';
import { UserForRegistration } from '../../types/user';

export interface RegisterState {
  user: UserForRegistration;
  errors: GenericErrors;
  signingUp: boolean;
}

const initialState: RegisterState = {
  user: {
    username: '',
    email: '',
    password: '',
  },
  errors: {},
  signingUp: false,
};

const slice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    initializeRegister: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof RegisterState['user']; value: string }>
    ) => {
      state.user[name] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      // register
      .addCase(register.pending, (state) => {
        state.signingUp = true;
      })
      .addCase(register.fulfilled, (state) => {
        state.signingUp = false;
        location.href = '/';
      })
      .addCase(register.rejected, (state, { payload: errors }) => {
        if (errors) state.errors = errors;
        state.signingUp = false;
      });
  },
});

export const { initializeRegister, updateField } = slice.actions;

export default slice.reducer;
