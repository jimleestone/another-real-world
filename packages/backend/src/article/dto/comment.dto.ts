import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { AuthorResponse, authorSelect } from './author.dto';

export class CommentResponse {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  body: boolean;
  author: AuthorResponse;
}

export class CommentRO {
  comment: CommentResponse;
}

export class CommentsRO {
  comments: CommentResponse[];
}

export class CreateCommentInput {
  @IsNotEmpty()
  readonly body: string;
}

export class CreateCommentInputRO {
  @ValidateNested()
  @Type(() => CreateCommentInput)
  comment: CreateCommentInput;
}

export const commentSelect = (userId: number) => {
  return Prisma.validator<Prisma.CommentSelect>()({
    id: true,
    createdAt: true,
    updatedAt: true,
    body: true,
    author: {
      select: authorSelect(userId),
    },
  });
};

export const commentWrapper = (comment) => {
  const { followedBy, ...authorRest } = comment.author;
  return {
    ...comment,
    author: {
      ...authorRest,
      following: Array.isArray(followedBy) && !!followedBy.length,
    },
  };
};
