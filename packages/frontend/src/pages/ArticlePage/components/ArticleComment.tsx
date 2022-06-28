import { Option } from '@hqoss/monads';
import { format } from 'date-fns';
import React from 'react';
import { Link } from 'react-router-dom';
import { deleteComment, getComments } from '../../../services/comment.service';
import { store } from '../../../store/store';
import { Comment } from '../../../types/comment';
import { User } from '../../../types/user';

export default function ArticleComment({
  comment: {
    id,
    body,
    createdAt,
    author: { username, image },
  },
  slug,
  index,
  user,
}: {
  comment: Comment;
  slug: string;
  index: number;
  user: Option<User>;
}) {
  return (
    <React.Fragment>
      <div className='card'>
        <div className='card-block'>
          <p className='card-text'>{body}</p>
        </div>
        <div className='card-footer'>
          <Link className='comment-author' to={`/profile/${username}`}>
            <img src={image || undefined} className='comment-author-img' />
          </Link>
          &nbsp;
          <Link className='comment-author' to={`/profile/${username}`}>
            {username}
          </Link>
          <span className='date-posted'>{format(createdAt, 'PP')}</span>
          {user.isSome() && user.unwrap().username === username && (
            <span className='mod-options'>
              <i
                className='ion-trash-a'
                aria-label={`Delete comment ${index + 1}`}
                onClick={() => onDeleteComment(slug, id)}
              ></i>
            </span>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

async function onDeleteComment(slug: string, id: number) {
  await store.dispatch(deleteComment({ slug, id }));
  await store.dispatch(getComments(slug));
}
