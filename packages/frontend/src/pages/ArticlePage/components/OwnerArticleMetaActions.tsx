import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteArticle } from '../../../services/article.service';
import { store } from '../../../store/store';
import { Article } from '../../../types/article';

export default function OwnerArticleMetaActions({
  article: { slug },
  deletingArticle,
}: {
  article: Article;
  deletingArticle: boolean;
}) {
  const nav = useNavigate();
  return (
    <React.Fragment>
      <button className='btn btn-outline-secondary btn-sm' onClick={() => nav(`/editor/${slug}`)}>
        <i className='ion-plus-round'></i>
        &nbsp; Edit Article
      </button>
      &nbsp;
      <button
        className='btn btn-outline-danger btn-sm'
        disabled={deletingArticle}
        onClick={() => onDeleteArticle(slug)}
      >
        <i className='ion-heart'></i>
        &nbsp; Delete Article
      </button>
    </React.Fragment>
  );
}

async function onDeleteArticle(slug: string) {
  await store.dispatch(deleteArticle(slug));
  location.href = '/';
}
