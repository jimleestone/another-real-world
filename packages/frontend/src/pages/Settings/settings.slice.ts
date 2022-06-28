import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as R from 'ramda';
import { updateUser } from '../../services/user.service';
import { logout } from '../../store/common/common.slice';
import { GenericErrors } from '../../types/error';
import { User, UserSettings } from '../../types/user';

export interface SettingsState {
  user: UserSettings;
  errors: GenericErrors;
  updating: boolean;
}

const initialState: SettingsState = {
  user: { username: '', email: '', password: null, bio: null, image: null },
  errors: {},
  updating: false,
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    initializeSettings: (state, { payload: user }: PayloadAction<User>) => {
      state.user = { ...R.dissoc('token')(user), password: null };
    },
    updateField: (state, { payload: { name, value } }: PayloadAction<{ name: keyof UserSettings; value: string }>) => {
      state.user[name] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      // update user
      .addCase(updateUser.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.updating = false;
        slice.caseReducers.initializeSettings(state, action);
      })
      .addCase(updateUser.rejected, (state, { payload: errors }) => {
        if (errors) state.errors = errors;
        state.updating = false;
      })

      // logout
      .addCase(logout.type, () => initialState);
  },
});

export const { initializeSettings, updateField } = slice.actions;

export default slice.reducer;
