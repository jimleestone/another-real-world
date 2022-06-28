import { createSlice, isFulfilled, isPending, isRejected, PayloadAction } from '@reduxjs/toolkit';
import * as R from 'ramda';
import { createArticle, getArticle, updateArticle } from '../../services/article.service';
import { Article, ArticleForEditor } from '../../types/article';
import { GenericErrors } from '../../types/error';

export interface EditorState {
  article: ArticleForEditor;
  tag: string;
  submitting: boolean;
  errors: GenericErrors;
  loading: boolean;
}

const initialState: EditorState = {
  article: { title: '', body: '', tagList: [], description: '' },
  tag: '',
  submitting: false,
  errors: {},
  loading: true,
};

const slice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    initializeEditor: () => initialState,
    updateField: (
      state,
      { payload: { name, value } }: PayloadAction<{ name: keyof EditorState['article'] | 'tag'; value: string }>
    ) => {
      if (name === 'tag') {
        state.tag = value;
        return;
      }
      if (name !== 'tagList') {
        state.article[name] = value;
      }
    },
    addTag: (state) => {
      if (state.tag.length > 0) {
        state.article.tagList.push(state.tag);
        state.tag = '';
      }
    },
    removeTag: (state, { payload: index }: PayloadAction<number>) => {
      state.article.tagList = R.remove(index, 1, state.article.tagList);
    },
  },
  extraReducers: (builder) => {
    builder
      // load article
      .addCase(getArticle.pending, () => initialState)
      .addCase(getArticle.fulfilled, (state, { payload: article }: PayloadAction<ArticleForEditor>) => {
        state.article = article;
        state.loading = false;
      })
      .addCase(getArticle.rejected, (_, { meta: { arg } }) => {
        if (arg.owner) location.href = '/';
      });

    builder
      // create or update article
      .addMatcher(isPending(createArticle, updateArticle), (state) => {
        state.submitting = true;
      })
      .addMatcher(isFulfilled(createArticle, updateArticle), (_, { payload: { slug } }: PayloadAction<Article>) => {
        location.href = `/article/${slug}`;
      })
      .addMatcher(isRejected(createArticle, updateArticle), (state, { payload: errors }) => {
        if (errors) state.errors = errors;
        state.submitting = false;
      });
  },
});

export const { initializeEditor, updateField, addTag, removeTag } = slice.actions;

export default slice.reducer;
