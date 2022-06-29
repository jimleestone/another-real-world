import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import Utility from 'src/shared/utils';
import { AuthorResponse, authorSelect } from './author.dto';

export class ArticleResponse {
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: AuthorResponse;
  favoritesCount: number;
  favorited: boolean;
  tags: string[];
}

export class ArticleRO {
  article: ArticleResponse;
}

export class ArticlesRO {
  articles: ArticleResponse[];
  articlesCount: number;
}

export class FeedQueryFilter {
  /**
   * return records size
   * @default 20
   */
  @Max(100)
  @Min(1)
  @IsInt()
  @Type(() => Number) // this operation would parse ''(empty string) or '  '(white spaces) into 0(number), maybe it is a bug of the class-transformer lib
  limit?: number = 20;

  /**
   * return records offset
   * @default 0
   */
  @Min(0)
  @IsInt()
  @Type(() => Number)
  offset?: number = 0;
}

export class ArticleQueryFilter extends FeedQueryFilter {
  /**
   * search articles with a tag
   */
  @IsNotEmpty()
  @IsOptional()
  tag?: string;

  /**
   * search articles belong to a specified author
   */
  @IsNotEmpty()
  @IsOptional()
  author?: string;

  /**
   * search articles within a user's favorites
   */
  @IsNotEmpty()
  @IsOptional()
  favorited?: string;
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

export class ArticleInputRO {
  @ValidateNested()
  @Type(() => ArticleInput)
  article: ArticleInput;
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
            favoritedBy: {
              username: query.favorited,
            },
          },
        },
      },
      {
        tags: {
          some: query?.tag && {
            tag: {
              name: query.tag,
            },
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
      select: authorSelect(userId),
    },
    favoritedBy: !!userId && {
      select: { favoritedBy: true },
      where: { userId },
    },
    _count: {
      select: { favoritedBy: true },
    },
    tags: { select: { tag: { select: { name: true } } } },
  });
};

export const createArticleInput = (userId: number, input: ArticleInput) => {
  return Prisma.validator<Prisma.ArticleCreateInput>()({
    title: input.title,
    description: input.description,
    body: input.body,
    author: {
      connect: { id: userId },
    },
    slug: Utility.slugify(input.title),
    tags: {
      create: input.tagList.map((name) => {
        return {
          tag: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        };
      }),
    },
  });
};

export const updateArticleInput = (articleId: number, input: ArticleInput) => {
  return Prisma.validator<Prisma.ArticleUpdateInput>()({
    title: input.title,
    description: input.description,
    body: input.body,
    tags: {
      // delete relation
      deleteMany: { articleId },
      // connect again
      create: input.tagList.map((name) => {
        return {
          tag: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        };
      }),
    },
    slug: Utility.slugify(input.title),
    updatedAt: new Date(),
  });
};

export const feedQueryFilter = (userId: number) => {
  return Prisma.validator<Prisma.ArticleWhereInput>()({
    del: false,
    author: {
      followedBy: { some: { followerId: userId } },
    },
  });
};

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
    tagList: tags.map((t) => t.tag.name),
  };
};
