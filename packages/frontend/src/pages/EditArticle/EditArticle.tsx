import React, { Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArticleEditor } from '../../components/ArticleEditor/ArticleEditor';
import { getArticle, updateArticle } from '../../services/article.service';
import { store } from '../../store/store';
import { useStore } from '../../store/store-hooks';

export function EditArticle() {
  const { slug } = useParams<{ slug: string }>() as { slug: string };
  const { loading } = useStore(({ editor }) => editor);

  useEffect(() => {
    _loadArticle(slug);
  }, [slug]);

  return <Fragment>{!loading && <ArticleEditor onSubmit={onSubmit(slug)} />}</Fragment>;
}

async function _loadArticle(slug: string) {
  await store.dispatch(getArticle({ slug, owner: store.getState().common.user.unwrap().username }));
}

function onSubmit(slug: string): (ev: React.FormEvent) => void {
  return async (ev) => {
    ev.preventDefault();
    await store.dispatch(updateArticle({ slug, article: store.getState().editor.article }));
  };
}
