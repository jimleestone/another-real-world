import { Option } from '@hqoss/monads';
import React from 'react';
import { Article } from '../../../types/article';
import { User } from '../../../types/user';
import { MetaSectionState } from '../article-page.slice';
import ArticleMeta from './ArticleMeta';

export default function ArticlePageBanner(props: {
  article: Article;
  metaSection: MetaSectionState;
  user: Option<User>;
}) {
  return (
    <React.Fragment>
      <div className='banner'>
        <div className='container'>
          <h1>{props.article.title}</h1>

          <ArticleMeta {...props} />
        </div>
      </div>
    </React.Fragment>
  );
}
