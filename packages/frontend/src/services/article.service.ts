import { createAsyncThunk } from '@reduxjs/toolkit';
import { object } from 'decoders';
import {
  Article,
  articleDecoder,
  ArticleForEditor,
  ArticlesFilters,
  FeedFilters,
  MultipleArticles,
  multipleArticlesDecoder,
} from '../types/article';
import { GenericErrors } from '../types/error';
import { objectToQueryString } from '../utils/object';
import { get, post, put, remove } from './api-service';

export const getArticles = createAsyncThunk<MultipleArticles, ArticlesFilters>(
  'getArticles',
  async (filters, { rejectWithValue }) => {
    const finalFilters: ArticlesFilters = {
      limit: 10,
      offset: 0,
      ...filters,
    };
    const result = await get<MultipleArticles>(
      `/articles?${objectToQueryString(finalFilters)}`,
      multipleArticlesDecoder
    );
    return result.isOk() ? result.ok().unwrap() : rejectWithValue(result.err().unwrap());
  }
);

export const getFeed = createAsyncThunk<MultipleArticles, FeedFilters>(
  'getFeed',
  async (filters, { rejectWithValue }) => {
    const finalFilters: ArticlesFilters = {
      limit: 10,
      offset: 0,
      ...filters,
    };
    const result = await get<MultipleArticles>(
      `/articles/feed?${objectToQueryString(finalFilters)}`,
      multipleArticlesDecoder
    );
    return result.isOk() ? result.ok().unwrap() : rejectWithValue(result.err().unwrap());
  }
);

export const getArticle = createAsyncThunk<Article, { slug: string; owner?: string }>(
  'getArticle',
  async ({ slug, owner }, { rejectWithValue }) => {
    const result = await get<{ article: Article }>(`/articles/${slug}`, object({ article: articleDecoder }));
    if (result.isOk()) {
      const article = result.ok().unwrap().article;
      if (owner && article.author.username !== owner) {
        return rejectWithValue('not be the owner of the article');
      }
      return article;
    } else {
      return rejectWithValue(result.err().unwrap());
    }
  }
);

export const favorite = createAsyncThunk<Article, { slug: string; index: number }>(
  'favorite',
  async ({ slug }, { rejectWithValue }) => {
    const result = await post<{ article: Article }>(
      `/articles/${slug}/favorite`,
      undefined,
      object({ article: articleDecoder })
    );
    return result.isOk() ? result.ok().unwrap().article : rejectWithValue(result.err().unwrap());
  }
);

export const unfavorite = createAsyncThunk<Article, { slug: string; index: number }>(
  'unfavorite',
  async ({ slug }, { rejectWithValue }) => {
    const result = await remove<{ article: Article }>(
      `/articles/${slug}/favorite`,
      object({ article: articleDecoder })
    );
    return result.isOk() ? result.ok().unwrap().article : rejectWithValue(result.err().unwrap());
  }
);

export const deleteArticle = createAsyncThunk<void, string>('deleteArticle', async (slug) => {
  await remove(`/articles/${slug}`);
});

export const updateArticle = createAsyncThunk<
  Article,
  { slug: string; article: ArticleForEditor },
  { rejectValue: GenericErrors }
>('updateArticle', async ({ slug, article }, { rejectWithValue }) => {
  const result = await put<{ article: Article }>(`/articles/${slug}`, { article }, object({ article: articleDecoder }));
  return result.isOk() ? result.ok().unwrap().article : rejectWithValue(result.err().unwrap());
});

export const createArticle = createAsyncThunk<Article, ArticleForEditor, { rejectValue: GenericErrors }>(
  'createArticle',
  async (article, { rejectWithValue }) => {
    const result = await post(`/articles`, { article }, object({ article: articleDecoder }));
    return result.isOk() ? result.ok().unwrap().article : rejectWithValue(result.err().unwrap());
  }
);
