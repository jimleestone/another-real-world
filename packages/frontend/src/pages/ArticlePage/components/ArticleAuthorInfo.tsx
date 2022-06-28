import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../../types/article';

export default function ArticleAuthorInfo({
  article: {
    author: { username, image },
    createdAt,
  },
}: {
  article: Article;
}) {
  return (
    <React.Fragment>
      <Link to={`/profile/${username}`}>
        <img src={image || undefined} />
      </Link>
      <div className='info'>
        <Link className='author' to={`/profile/${username}`}>
          {username}
        </Link>
        <span className='date'>{format(createdAt, 'PP')}</span>
      </div>
    </React.Fragment>
  );
}
