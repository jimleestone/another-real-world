import { Article, Comment, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsInt, IsNotEmpty } from 'class-validator';
import slug from 'slug';

export interface CommentsRO {
  comments: Comment[];
}

export interface ArticleRO {
  article: Article;
}

export interface ArticlesRO {
  articles: Article[];
  articlesCount: number;
}

export class ArticleQueryFilter {
  tag?: string;

  author?: string;

  favorited?: string;

  @IsInt()
  @Type(() => Number)
  limit?: number = 20;

  @IsInt()
  @Type(() => Number)
  offset?: number = 0;
}

export class ArticleInput {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly body: string;

  @ArrayNotEmpty()
  readonly tagList: string[];
}

export class CreateCommentInput {
  @IsNotEmpty()
  readonly body: string;
}

export const articleQueryFilter = (query: ArticleQueryFilter) => {
  return Prisma.validator<Prisma.ArticleWhereInput>()({
    AND: [
      {
        del: false,
      },
      {
        author: {
          username: query.author,
        },
      },
      {
        favoritedBy: {
          // this "some" operator somehow could not work with the nested undefined value in an "AND" array
          some: query?.favorited && {
            username: query.favorited,
          },
        },
      },
      {
        tags: {
          some: query?.tag && {
            name: query.tag,
          },
        },
      },
    ],
  });
};

export const articleSelect = (userId: number) => {
  return Prisma.validator<Prisma.ArticleSelect>()({
    slug: true,
    title: true,
    description: true,
    body: true,
    createdAt: true,
    updatedAt: true,
    author: {
      select: {
        username: true,
        bio: true,
        image: true,
        // when not logged in do not query this field
        followedBy: !!userId && {
          select: { id: true },
          where: {
            id: userId,
          },
        },
      },
    },
    favoritedBy: !!userId && {
      select: { id: true },
      where: {
        id: userId,
      },
    },
    _count: {
      select: { favoritedBy: true },
    },
    tags: {
      select: { name: true },
    },
  });
};

export const commentSelect = (userId: number) => {
  return Prisma.validator<Prisma.CommentSelect>()({
    id: true,
    createdAt: true,
    updatedAt: true,
    body: true,
    author: {
      select: {
        username: true,
        bio: true,
        image: true,
        followedBy: !!userId && {
          select: { id: true },
          where: {
            id: userId,
          },
        },
      },
    },
  });
};

export const createArticleInput = (userId: number, input: ArticleInput) => {
  return Prisma.validator<Prisma.ArticleCreateInput>()({
    title: input.title,
    description: input.description,
    body: input.body,
    tags: {
      connectOrCreate: input.tagList.map((name) => {
        return {
          where: {
            name,
          },
          create: {
            name,
          },
        };
      }),
    },
    author: {
      connect: { id: userId },
    },
    slug: slugify(input.title),
  });
};

export const updateArticleInput = (input: ArticleInput) => {
  return Prisma.validator<Prisma.ArticleUpdateInput>()({
    title: input.title,
    description: input.description,
    body: input.body,
    tags: {
      // delete relation
      set: [],
      // connect again
      connectOrCreate: input.tagList.map((name) => {
        return {
          where: {
            name,
          },
          create: {
            name,
          },
        };
      }),
    },
    slug: slugify(input.title),
    updatedAt: new Date(),
  });
};

export const feedQueryFilter = (userId: number) => {
  return Prisma.validator<Prisma.ArticleWhereInput>()({
    del: false,
    author: {
      followedBy: { some: { id: userId } },
    },
  });
};

function slugify(title: string) {
  return `${slug(title, { lower: true })}-${(
    (Math.random() * Math.pow(36, 6)) |
    0
  ).toString(36)}`;
}

export const articleWrapper = (article) => {
  const { _count, favoritedBy, tags, ...rest } = article;
  const { followedBy, ...authorRest } = article.author;
  return {
    ...rest,
    author: {
      ...authorRest,
      following: Array.isArray(followedBy) && !!followedBy.length,
    },
    favoritesCount: _count.favoritedBy,
    favorited: Array.isArray(favoritedBy) && !!favoritedBy.length,
    tagList: tags.map((t) => t.name),
  };
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
