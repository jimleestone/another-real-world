import React from 'react';
import { favorite, unfavorite } from '../../../services/article.service';
import { follow, unFollow } from '../../../services/profile.service';
import { store } from '../../../store/store';
import { Article } from '../../../types/article';
import { classObjectToClassName } from '../../../utils/style';

export default function NonOwnerArticleMetaActions({
  article: {
    slug,
    favoritesCount,
    favorited,
    author: { username, following },
  },
  submittingFavorite,
  submittingFollow,
}: {
  article: Article;
  submittingFavorite: boolean;
  submittingFollow: boolean;
}) {
  return (
    <React.Fragment>
      <button
        className={classObjectToClassName({
          btn: true,
          'btn-sm': true,
          'btn-outline-secondary': !following,
          'btn-secondary': following,
        })}
        disabled={submittingFollow}
        onClick={() => onFollow(username, following)}
      >
        <i className='ion-plus-round'></i>
        &nbsp; {(following ? 'Unfollow ' : 'Follow ') + username}
      </button>
      &nbsp;
      <button
        className={classObjectToClassName({
          btn: true,
          'btn-sm': true,
          'btn-outline-primary': !favorited,
          'btn-primary': favorited,
        })}
        disabled={submittingFavorite}
        onClick={() => onFavorite(slug, favorited)}
      >
        <i className='ion-heart'></i>
        &nbsp; {(favorited ? 'Unfavorite ' : 'Favorite ') + 'Article'}
        <span className='counter'>({favoritesCount})</span>
      </button>
    </React.Fragment>
  );
}

async function onFollow(username: string, following: boolean) {
  if (store.getState().common.user.isNone()) {
    location.href = '/login';
    return;
  }
  following ? await store.dispatch(follow(username)) : await store.dispatch(unFollow(username));
}

async function onFavorite(slug: string, favorited: boolean) {
  if (store.getState().common.user.isNone()) {
    location.href = '/login';
    return;
  }
  favorited ? await store.dispatch(unfavorite({ slug, index: 0 })) : await store.dispatch(favorite({ slug, index: 0 }));
}
