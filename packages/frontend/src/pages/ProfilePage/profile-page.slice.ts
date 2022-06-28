import { None, Option, Some } from '@hqoss/monads';
import { createSlice, isFulfilled, isPending, PayloadAction } from '@reduxjs/toolkit';
import { follow, getProfile, unFollow } from '../../services/profile.service';
import { Profile } from '../../types/profile';

export interface ProfilePageState {
  profile: Option<Profile>;
  submitting: boolean;
  selectedTab: string;
}

const initialState: ProfilePageState = {
  profile: None,
  submitting: false,
  selectedTab: 'My Articles',
};

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    changeTab: (state, { payload: tab }: PayloadAction<string>) => {
      state.selectedTab = tab;
    },
  },
  extraReducers: (builder) => {
    builder
      // load profile
      .addCase(getProfile.pending, () => initialState)
      .addCase(getProfile.fulfilled, (state, { payload: profile }) => {
        state.profile = Some(profile);
        state.submitting = false;
      })

      // follow or unFollow
      .addMatcher(isPending(follow, unFollow), (state) => ({ ...state, submitting: true }))
      .addMatcher(isFulfilled(follow, unFollow), (state, { payload: profile }) => {
        state.profile = Some(profile);
        state.submitting = false;
      });
  },
});

export const { changeTab } = slice.actions;

export default slice.reducer;
