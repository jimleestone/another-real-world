import React, { FormEvent, useEffect } from 'react';
import { initializeEditor } from '../../components/ArticleEditor/article-editor.slice';
import { ArticleEditor } from '../../components/ArticleEditor/ArticleEditor';
import { createArticle } from '../../services/article.service';
import { store } from '../../store/store';

export function NewArticle() {
  useEffect(() => {
    store.dispatch(initializeEditor());
  }, [null]);

  return (
    <React.Fragment>
      <ArticleEditor onSubmit={onSubmit} />
    </React.Fragment>
  );
}

async function onSubmit(ev: FormEvent) {
  ev.preventDefault();
  await store.dispatch(createArticle(store.getState().editor.article));
}
