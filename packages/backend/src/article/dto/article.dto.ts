import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import slug from 'slug';
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

export class ArticleQueryFilter {
  @ApiPropertyOptional({
    description: 'search articles with a tag',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    description: 'Search articles with a specified author',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: `search articles within a user's favorites`,
  })
  @IsOptional()
  @IsString()
  favorited?: string;

  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    default: 20,
    description: 'return record list size',
  })
  limit?: number = 20;

  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    default: 0,
    description: 'return record list offset',
  })
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
      select: authorSelect(userId),
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

function slugify(title: string) {
  return `${slug(title, { lower: true })}-${(
    (Math.random() * Math.pow(36, 6)) |
    0
  ).toString(36)}`;
}
