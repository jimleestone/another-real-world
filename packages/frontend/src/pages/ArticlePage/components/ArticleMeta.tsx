import { Option } from '@hqoss/monads';
import React from 'react';
import { Article } from '../../../types/article';
import { User } from '../../../types/user';
import { MetaSectionState } from '../article-page.slice';
import ArticleAuthorInfo from './ArticleAuthorInfo';
import NonOwnerArticleMetaActions from './NonOwnerArticleMetaActions';
import OwnerArticleMetaActions from './OwnerArticleMetaActions';

export default function ArticleMeta({
  article,
  metaSection: { submittingFavorite, submittingFollow, deletingArticle },
  user,
}: {
  article: Article;
  metaSection: MetaSectionState;
  user: Option<User>;
}) {
  return (
    <React.Fragment>
      <div className='article-meta'>
        <ArticleAuthorInfo article={article} />

        {user.isSome() && user.unwrap().username === article.author.username ? (
          <OwnerArticleMetaActions article={article} deletingArticle={deletingArticle} />
        ) : (
          <NonOwnerArticleMetaActions
            article={article}
            submittingFavorite={submittingFavorite}
            submittingFollow={submittingFollow}
          />
        )}
      </div>
    </React.Fragment>
  );
}
