import { ForbiddenException } from '@nestjs/common';
import {
  ArticleInput,
  ArticleQueryFilter,
  articleQueryFilter,
  articleSelect,
  articleWrapper,
  createArticleInput,
  FeedQueryFilter,
  feedQueryFilter,
  updateArticleInput,
} from '../dto/article.dto';
import { BaseArticleService } from './base-article.service';

export class ArticleService extends BaseArticleService {
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

  async findFeed(query: FeedQueryFilter): Promise<any> {
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
    const data = updateArticleInput(origin.id, input);
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
        tags: { deleteMany: { articleId: origin.id } },
        favoritedBy: { deleteMany: { articleId: origin.id } },
        comments: {
          updateMany: {
            where: { del: false },
            data: { del: true },
          },
        },
      },
    });
  }
}
