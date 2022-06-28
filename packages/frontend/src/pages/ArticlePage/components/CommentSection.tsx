import { Option } from '@hqoss/monads';
import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../../types/article';
import { User } from '../../../types/user';
import { CommentSectionState } from '../article-page.slice';
import ArticleComment from './ArticleComment';
import CommentForm from './CommentForm';

export default function CommentSection({
  user,
  article,
  commentSection: { submittingComment, commentBody, comments },
}: {
  user: Option<User>;
  article: Article;
  commentSection: CommentSectionState;
}) {
  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-xs-12 col-md-8 offset-md-2'>
          {user.match({
            none: () => (
              <p style={{ display: 'inherit' }}>
                <Link to='/login'>Sign in</Link> or <Link to='/register'>sign up</Link> to add comments on this article.
              </p>
            ),
            some: (user) => (
              <CommentForm
                user={user}
                slug={article.slug}
                submittingComment={submittingComment}
                commentBody={commentBody}
              />
            ),
          })}

          {comments.match({
            none: () => <div>Loading comments...</div>,
            some: (comments) => (
              <React.Fragment>
                {comments.map((comment, index) => (
                  <ArticleComment key={comment.id} comment={comment} slug={article.slug} user={user} index={index} />
                ))}
              </React.Fragment>
            ),
          })}
        </div>
      </div>
    </React.Fragment>
  );
}
