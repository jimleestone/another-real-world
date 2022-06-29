import { articleSelect, articleWrapper } from '../dto/article.dto';
import { BaseArticleService } from './base-article.service';

export class FavoriteService extends BaseArticleService {
  async favorite(slug: string): Promise<any> {
    await this.checkArticle(slug);

    const article = await this.prisma.article.update({
      where: { slug },
      data: {
        favoritedBy: {
          create: [{ favoritedBy: { connect: { id: this.req.user.id } } }],
        },
      },
      select: articleSelect(this.req.user.id),
    });
    const result = this.prisma.wrapResults(article, articleWrapper);
    return { article: result };
  }

  async unfavorite(slug: string): Promise<any> {
    const origin = await this.checkArticle(slug);

    const article = await this.prisma.article.update({
      where: { slug },
      data: {
        favoritedBy: {
          delete: {
            articleId_userId: {
              articleId: origin.id,
              userId: this.req.user.id,
            },
          },
        },
      },
      select: articleSelect(this.req.user.id),
    });

    const result = this.prisma.wrapResults(article, articleWrapper);
    return { article: result };
  }
}
