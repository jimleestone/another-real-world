import { None, Option, Some } from '@hqoss/monads';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getTags } from '../../services/tag.service';

export interface HomeState {
  tags: Option<string[]>;
  selectedTab: string;
}

const initialState: HomeState = {
  tags: None,
  selectedTab: 'Global Feed',
};

const slice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    changeTab: (state, { payload: tab }: PayloadAction<string>) => {
      state.selectedTab = tab;
    },
  },
  extraReducers: (builder) => {
    builder
      // load tags
      .addCase(getTags.pending, (state) => ({ ...state, tags: None }))
      .addCase(getTags.fulfilled, (state, { payload: { tags } }) => {
        state.tags = Some(tags);
      });
  },
});

export const { changeTab } = slice.actions;

export default slice.reducer;
