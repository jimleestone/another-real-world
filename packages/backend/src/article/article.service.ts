import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Article } from '@prisma/client';
import { PrismaService } from '../shared/services/prisma.service';
import {
  ArticleInput,
  ArticleQueryFilter,
  articleQueryFilter,
  articleSelect,
  articleWrapper,
  commentSelect,
  commentWrapper,
  createArticleInput,
  CreateCommentInput,
  feedQueryFilter,
  updateArticleInput,
} from './article.interface';

@Injectable({ scope: Scope.REQUEST })
export class ArticleService {
  constructor(
    @Inject(REQUEST) private readonly req: { user: { id: number } },
    private prisma: PrismaService,
  ) {}

  async findAll(query: ArticleQueryFilter): Promise<any> {
    const queryFilter = articleQueryFilter(query);
    const articles = await this.prisma.article.findMany({
      where: queryFilter,
      select: articleSelect(this.req.user.id),
      orderBy: { createdAt: 'desc' },
      skip: query.offset,
      take: query.limit,
    });
    const articlesCount = await this.prisma.article.count({
      where: queryFilter,
    });

    // wrap return
    const results = this.prisma.wrapResults(articles, articleWrapper);
    return { articles: results, articlesCount };
  }

  async findFeed(query: ArticleQueryFilter): Promise<any> {
    const queryFilter = feedQueryFilter(this.req.user.id);
    const articles = await this.prisma.article.findMany({
      where: queryFilter,
      select: articleSelect(this.req.user.id),
      orderBy: { createdAt: 'desc' },
      skip: query.offset,
      take: query.limit,
    });
    const articlesCount = await this.prisma.article.count({
      where: queryFilter,
    });
    const results = this.prisma.wrapResults(articles, articleWrapper);
    return { articles: results, articlesCount };
  }

  async findOne(slug: string): Promise<any> {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      select: { del: true, ...articleSelect(this.req.user.id) },
    });
    if (!article || article.del) return { article: null };

    delete article['del'];
    const result = this.prisma.wrapResults(article, articleWrapper);
    return { article: result };
  }

  async addComment(slug: string, { body }: CreateCommentInput): Promise<any> {
    await this.checkArticle(slug);

    const comment = await this.prisma.comment.create({
      data: {
        body,
        article: {
          connect: { slug },
        },
        author: {
          connect: { id: this.req.user.id },
        },
      },
      select: commentSelect(this.req.user.id),
    });
    const result = this.prisma.wrapResults(comment, commentWrapper);
    return { comment: result };
  }

  async deleteComment(slug: string, id: number): Promise<any> {
    const origin = await this.prisma.comment.findUnique({
      where: { id },
    });
    if (!origin || origin.del) throw new NotFoundException('Comment not found');
    if (this.req.user.id !== origin.authorId)
      throw new ForbiddenException('You are not the author of this comment');

    // use soft delete instead
    await this.prisma.comment.update({ where: { id }, data: { del: true } });
  }

  async favorite(slug: string): Promise<any> {
    await this.checkArticle(slug);

    const article = await this.prisma.article.update({
      where: { slug },
      data: {
        favoritedBy: {
          connect: { id: this.req.user.id },
        },
      },
      select: articleSelect(this.req.user.id),
    });
    const result = this.prisma.wrapResults(article, articleWrapper);
    return { article: result };
  }

  async unfavorite(slug: string): Promise<any> {
    await this.checkArticle(slug);

    const article = await this.prisma.article.update({
      where: { slug },
      data: {
        favoritedBy: {
          disconnect: { id: this.req.user.id },
        },
      },
      select: articleSelect(this.req.user.id),
    });

    const result = this.prisma.wrapResults(article, articleWrapper);
    return { article: result };
  }

  async findComments(slug: string): Promise<any> {
    await this.checkArticle(slug);
    const comments = await this.prisma.comment.findMany({
      where: { del: false, article: { slug } },
      orderBy: { createdAt: 'desc' },
      select: commentSelect(this.req.user.id),
    });
    const results = this.prisma.wrapResults(comments, commentWrapper);
    return { comments: results };
  }

  async create(input: ArticleInput): Promise<any> {
    const article = await this.prisma.article.create({
      data: createArticleInput(this.req.user.id, input),
      select: articleSelect(this.req.user.id),
    });

    const result = this.prisma.wrapResults(article, articleWrapper);
    return { article: result };
  }

  async update(slug: string, input: ArticleInput): Promise<any> {
    const origin = await this.checkArticle(slug);

    if (this.req.user.id !== origin.authorId)
      throw new ForbiddenException('You are not the author of this article');

    // init update data
    const data = updateArticleInput(input);
    if (origin.title === input.title) {
      // if title not changed remove title together with slug
      delete data['title'];
      delete data['slug'];
    }
    const article = await this.prisma.article.update({
      where: { slug },
      data,
      select: articleSelect(this.req.user.id),
    });
    const result = this.prisma.wrapResults(article, articleWrapper);
    return { article: result };
  }

  async delete(slug: string): Promise<void> {
    const origin = await this.checkArticle(slug);
    if (this.req.user.id !== origin.authorId) {
      throw new ForbiddenException('You are not the author of this article');
    }

    // use soft delete instead
    await this.prisma.article.update({
      where: { slug },
      data: {
        del: true,
        tags: {
          set: [],
        },
        favoritedBy: {
          set: [],
        },
        comments: {
          updateMany: {
            where: {
              del: false,
            },
            data: {
              del: true,
            },
          },
        },
      },
    });
  }

  private async checkArticle(slug: string): Promise<Article> {
    const origin = await this.prisma.article.findUnique({
      where: { slug },
    });
    if (!origin || origin.del) throw new NotFoundException('Article not found');
    return origin;
  }
}
