import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TagList } from '../../components/ArticlePreview/ArticlePreview';
import { getArticle } from '../../services/article.service';
import { getComments } from '../../services/comment.service';
import { store } from '../../store/store';
import { useStore } from '../../store/store-hooks';
import ArticleMeta from './components/ArticleMeta';
import ArticlePageBanner from './components/ArticlePageBanner';
import CommentSection from './components/CommentSection';

export function ArticlePage() {
  const { slug } = useParams<{ slug: string }>() as { slug: string };

  const {
    articlePage: { article, commentSection, metaSection },
    common: { user },
  } = useStore(({ articlePage, common }) => ({
    articlePage,
    common,
  }));

  useEffect(() => {
    onLoad(slug);
  }, [slug]);

  return (
    <React.Fragment>
      {article.match({
        none: () => <div>Loading article...</div>,
        some: (article) => (
          <div className='article-page'>
            <ArticlePageBanner {...{ article, metaSection, user }} />

            <div className='container page'>
              <div className='row article-content'>
                <div className='col-md-12'>{article.body}</div>
                <TagList tagList={article.tagList} />
              </div>

              <hr />

              <div className='article-actions'>
                <ArticleMeta {...{ article, metaSection, user }} />
              </div>

              <CommentSection {...{ user, commentSection, article }} />
            </div>
          </div>
        ),
      })}
    </React.Fragment>
  );
}

async function onLoad(slug: string) {
  await store.dispatch(getArticle({ slug }));
  await store.dispatch(getComments(slug));
}
