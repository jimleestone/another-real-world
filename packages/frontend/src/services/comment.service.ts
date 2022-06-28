import { createAsyncThunk } from '@reduxjs/toolkit';
import { array, object } from 'decoders';
import { Comment, commentDecoder } from '../types/comment';
import { get, post, remove } from './api-service';

export const getComments = createAsyncThunk<Comment[], string>('getComments', async (slug, { rejectWithValue }) => {
  const result = await get<{ comments: Comment[] }>(
    `/articles/${slug}/comments`,
    object({ comments: array(commentDecoder) })
  );
  return result.isOk() ? result.ok().unwrap().comments : rejectWithValue(result.err().unwrap());
});

export const createComment = createAsyncThunk<Comment, { slug: string; body: string }>(
  'createComment',
  async ({ slug, body }, { rejectWithValue }) => {
    const result = await post<{ comment: Comment }>(
      `/articles/${slug}/comments`,
      { comment: { body } },
      object({ comment: commentDecoder })
    );
    return result.isOk() ? result.ok().unwrap().comment : rejectWithValue(result.err().unwrap());
  }
);

export const deleteComment = createAsyncThunk<void, { slug: string; id: number }>(
  'deleteComment',
  async ({ slug, id }) => {
    await remove<void>(`/articles/${slug}/comments/${id}`);
  }
);
