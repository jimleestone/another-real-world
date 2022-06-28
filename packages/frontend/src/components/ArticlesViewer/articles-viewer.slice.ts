import { None, Option, Some } from '@hqoss/monads';
import { createSlice, isFulfilled, isPending, PayloadAction } from '@reduxjs/toolkit';
import * as R from 'ramda';
import { favorite, getArticles, getFeed, unfavorite } from '../../services/article.service';
import { Article } from '../../types/article';

export interface ArticleViewerArticle {
  article: Article;
  isSubmitting: boolean;
}

export interface ArticleViewerState {
  articles: Option<readonly ArticleViewerArticle[]>;
  currentPage: number;
  articlesCount: number;
}

const initialState: ArticleViewerState = {
  articles: None,
  currentPage: 1,
  articlesCount: 0,
};

const slice = createSlice({
  name: 'articleViewer',
  initialState,
  reducers: {
    changePage: (state, { payload: page }: PayloadAction<number>) => {
      state.currentPage = page;
      state.articles = None;
    },
  },
  extraReducers: (builder) => {
    builder
      // load articles or feed
      .addMatcher(isPending(getArticles, getFeed), () => initialState)
      .addMatcher(isFulfilled(getArticles, getFeed), (state, { payload: { articles, articlesCount } }) => {
        state.articles = Some(articles.map((article) => ({ article, isSubmitting: false })));
        state.articlesCount = articlesCount;
      })

      // favorite or unfavorite
      .addMatcher(isPending(favorite, unfavorite), (state, { meta: { arg } }) => {
        state.articles = state.articles.map(R.adjust(arg.index, R.assoc('isSubmitting', true)));
      })
      .addMatcher(isFulfilled(favorite, unfavorite), (state, { meta: { arg }, payload: article }) => {
        state.articles = state.articles.map(
          R.update<ArticleViewerArticle>(arg.index, { article, isSubmitting: false })
        );
      });
  },
});

export const { changePage } = slice.actions;

export default slice.reducer;
