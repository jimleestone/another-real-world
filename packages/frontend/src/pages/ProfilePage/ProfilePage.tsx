import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { changePage } from '../../components/ArticlesViewer/articles-viewer.slice';
import { ArticlesViewer } from '../../components/ArticlesViewer/ArticlesViewer';
import { UserInfo } from '../../components/UserInfo/UserInfo';
import { getArticles } from '../../services/article.service';
import { follow, getProfile, unFollow } from '../../services/profile.service';
import { store } from '../../store/store';
import { useStore } from '../../store/store-hooks';
import { Profile } from '../../types/profile';
import { changeTab } from './profile-page.slice';

export function ProfilePage() {
  const { selectedTab } = useStore(({ profile }) => profile);

  const { username } = useParams<{ username: string }>() as { username: string };
  const favorites = selectedTab === 'Favorited Articles';
  const nav = useNavigate();

  useEffect(() => {
    onLoad(username, favorites);
  }, [username]);

  const { profile, submitting } = useStore(({ profile }) => profile);

  return (
    <React.Fragment>
      <div className='profile-page'>
        {profile.match({
          none: () => (
            <div className='article-preview' key={1}>
              Loading profile...
            </div>
          ),
          some: (profile) => (
            <UserInfo
              user={profile}
              disabled={submitting}
              onFollowToggle={onFollowToggle(profile)}
              onEditSettings={() => nav('/settings')}
            />
          ),
        })}

        <div className='container'>
          <div className='row'>
            <div className='col-xs-12 col-md-10 offset-md-1'>
              <ArticlesViewer
                toggleClassName='articles-toggle'
                tabs={['My Articles', 'Favorited Articles']}
                selectedTab={selectedTab}
                onTabChange={onTabChange(username)}
                onPageChange={onPageChange(username, favorites)}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

async function onLoad(username: string, favorites: boolean) {
  await store.dispatch(getProfile(username));
  await getArticlesByType(username, favorites);
}

async function getArticlesByType(username: string, favorites: boolean) {
  const { currentPage } = store.getState().articleViewer;
  await store.dispatch(getArticles({ [favorites ? 'favorited' : 'author']: username, offset: (currentPage - 1) * 10 }));
}

function onFollowToggle(profile: Profile): () => void {
  return async () => {
    const { user } = store.getState().common;
    if (user.isNone()) {
      location.href = '/login';
      return;
    }
    profile.following
      ? await store.dispatch(unFollow(profile.username))
      : await store.dispatch(follow(profile.username));
  };
}

function onTabChange(username: string): (page: string) => void {
  return async (page) => {
    store.dispatch(changeTab(page));
    const favorited = page === 'Favorited Articles';
    await getArticlesByType(username, favorited);
  };
}

function onPageChange(username: string, favorited: boolean): (index: number) => void {
  return async (index) => {
    store.dispatch(changePage(index));
    await getArticlesByType(username, favorited);
  };
}
