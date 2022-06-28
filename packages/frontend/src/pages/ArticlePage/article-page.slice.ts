import { None, Option, Some } from '@hqoss/monads';
import { createSlice, isFulfilled, isPending, PayloadAction } from '@reduxjs/toolkit';
import { deleteArticle, favorite, getArticle, unfavorite } from '../../services/article.service';
import { createComment, getComments } from '../../services/comment.service';
import { follow, unFollow } from '../../services/profile.service';
import { Article } from '../../types/article';
import { Comment } from '../../types/comment';
import { Profile } from '../../types/profile';

export interface CommentSectionState {
  comments: Option<Comment[]>;
  commentBody: string;
  submittingComment: boolean;
}

export interface MetaSectionState {
  submittingFavorite: boolean;
  submittingFollow: boolean;
  deletingArticle: boolean;
}

export interface ArticlePageState {
  article: Option<Article>;
  commentSection: CommentSectionState;
  metaSection: MetaSectionState;
}

const initialState: ArticlePageState = {
  article: None,
  commentSection: {
    comments: None,
    commentBody: '',
    submittingComment: false,
  },
  metaSection: {
    submittingFavorite: false,
    submittingFollow: false,
    deletingArticle: false,
  },
};

const slice = createSlice({
  name: 'articlePage',
  initialState,
  reducers: {
    updateCommentBody: (state, { payload: commentBody }: PayloadAction<string>) => {
      state.commentSection.commentBody = commentBody;
    },
  },
  extraReducers: (builder) => {
    builder
      // delete article
      .addCase(deleteArticle.pending, (state) => {
        state.metaSection.deletingArticle = true;
      })

      // load article
      .addCase(getArticle.pending, () => initialState)

      // load comments
      .addCase(getComments.fulfilled, (state, { payload: comments }: PayloadAction<Comment[]>) => {
        state.commentSection.comments = Some(comments);
        state.commentSection.commentBody = '';
        state.commentSection.submittingComment = false;
      })

      // create comment
      .addCase(createComment.pending, (state) => {
        state.commentSection.submittingComment = true;
      });

    builder
      // follow or unFollow
      .addMatcher(isPending(follow, unFollow), (state) => {
        state.metaSection.submittingFollow = true;
      })
      .addMatcher(isFulfilled(follow, unFollow), (state, { payload: author }: PayloadAction<Profile>) => {
        state.article = state.article.map((article) => ({ ...article, author }));
        state.metaSection.submittingFollow = false;
      })

      // favorite or unfavorite
      .addMatcher(isPending(favorite, unfavorite), (state) => {
        state.metaSection.submittingFavorite = true;
      })
      .addMatcher(
        isFulfilled(favorite, unfavorite, getArticle),
        (state, { payload: article }: PayloadAction<Article>) => {
          state.article = Some(article);
          state.metaSection.submittingFavorite = false;
        }
      );
  },
});

export const { updateCommentBody } = slice.actions;

export default slice.reducer;
