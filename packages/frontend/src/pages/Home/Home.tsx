import React from 'react';
import { changePage } from '../../components/ArticlesViewer/articles-viewer.slice';
import { ArticlesViewer } from '../../components/ArticlesViewer/ArticlesViewer';
import { ContainerPage } from '../../components/ContainerPage/ContainerPage';
import { getArticles, getFeed } from '../../services/article.service';
import { getTags } from '../../services/tag.service';
import { store } from '../../store/store';
import { useStoreWithInitializer } from '../../store/store-hooks';
import { FeedFilters } from '../../types/article';
import HomeBanner from './components/HomeBanner';
import HomeSidebar from './components/HomeSidebar';
import { changeTab } from './home.slice';

export function Home() {
  const { tags, selectedTab } = useStoreWithInitializer(({ home }) => home, load);

  return (
    <React.Fragment>
      <div className='home-page'>
        <HomeBanner />
        <ContainerPage>
          <div className='col-md-9'>
            <ArticlesViewer
              toggleClassName='feed-toggle'
              selectedTab={selectedTab}
              tabs={buildTabsNames(selectedTab)}
              onPageChange={onPageChange}
              onTabChange={onTabChange}
            />
          </div>

          <div className='col-md-3'>
            <HomeSidebar onTabChange={onTabChange} tags={tags} />
          </div>
        </ContainerPage>
      </div>
    </React.Fragment>
  );
}

async function load() {
  if (store.getState().common.user.isSome()) {
    store.dispatch(changeTab('Your Feed'));
  }
  await store.dispatch(getTags());
  await getFeedOrGlobalArticles();
}

function buildTabsNames(selectedTab: string) {
  const { user } = store.getState().common;
  return Array.from(new Set([...(user.isSome() ? ['Your Feed'] : []), 'Global Feed', selectedTab]));
}

async function onPageChange(index: number) {
  store.dispatch(changePage(index));
  await getFeedOrGlobalArticles({ offset: (index - 1) * 10 });
}

async function onTabChange(tab: string) {
  store.dispatch(changeTab(tab));
  await getFeedOrGlobalArticles();
}

async function getFeedOrGlobalArticles(filters: FeedFilters = {}) {
  const { selectedTab } = store.getState().home;
  const finalFilters = {
    ...filters,
    tag: selectedTab.slice(2),
  };
  selectedTab === 'Your Feed'
    ? await store.dispatch(getFeed(filters))
    : await store.dispatch(getArticles(!selectedTab.startsWith('#') ? filters : finalFilters));
}
