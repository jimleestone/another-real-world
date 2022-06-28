import React, { ReactElement } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { ArticlePage } from './pages/ArticlePage/ArticlePage';
import { EditArticle } from './pages/EditArticle/EditArticle';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { NewArticle } from './pages/NewArticle/NewArticle';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { Register } from './pages/Register/Register';
import { Settings } from './pages/Settings/Settings';
import { getUser } from './services/user.service';
import { endLoad } from './store/common/common.slice';
import { store } from './store/store';
import { useStoreWithInitializer } from './store/store-hooks';

export default function App() {
  const { loading, user } = useStoreWithInitializer(({ common }) => common, load);

  const userIsLogged = user.isSome();

  return (
    <>
      {!loading && (
        <React.Fragment>
          <Header />
          <Routes>
            <Route index element={<Home />} />
            <Route path='profile/:username' element={<ProfilePage />} />
            <Route path='article/:slug' element={<ArticlePage />} />
            <Route element={<ProtectedRoute isAllowed={userIsLogged} redirectPath='/login' />}>
              <Route path='settings' element={<Settings />} />
              <Route path='editor' element={<NewArticle />} />
              <Route path='editor/:slug' element={<EditArticle />} />
            </Route>
            <Route element={<ProtectedRoute isAllowed={!userIsLogged} redirectPath='/' />}>
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
            </Route>
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
          <Footer />
        </React.Fragment>
      )}
    </>
  );
}

async function load() {
  const token = localStorage.getItem('token');
  if (!store.getState().common.loading || !token) {
    store.dispatch(endLoad());
    return;
  }
  await store.dispatch(getUser());
}

function ProtectedRoute({
  isAllowed,
  redirectPath,
  children,
}: {
  isAllowed: boolean;
  redirectPath: string;
  children?: ReactElement;
}) {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return children ? (children as ReactElement) : <Outlet />;
}
