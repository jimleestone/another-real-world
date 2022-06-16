import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Article } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class BaseArticleService {
  constructor(
    @Inject(REQUEST) protected readonly req: { user: { id: number } },
    protected prisma: PrismaService,
  ) {}

  protected async checkArticle(slug: string): Promise<Article> {
    const origin = await this.prisma.article.findUnique({
      where: { slug },
    });
    if (!origin || origin.del) throw new NotFoundException('Article not found');
    return origin;
  }
}
