import { Action, configureStore } from '@reduxjs/toolkit';
import editor from '../components/ArticleEditor/article-editor.slice';
import articleViewer from '../components/ArticlesViewer/articles-viewer.slice';
import articlePage from '../pages/ArticlePage/article-page.slice';
import home from '../pages/Home/home.slice';
import login from '../pages/Login/login.slice';
import profile from '../pages/ProfilePage/profile-page.slice';
import register from '../pages/Register/register.slice';
import settings from '../pages/Settings/settings.slice';
import common from './common/common.slice';

const middlewareConfiguration = { serializableCheck: false };

export const store = configureStore({
  reducer: {
    common,
    home,
    login,
    settings,
    register,
    editor,
    articleViewer,
    profile,
    articlePage,
  },
  devTools: {
    name: 'Conduit',
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(middlewareConfiguration),
});
export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
}
