import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './services/article.service';
import { CommentService } from './services/comment.service';
import { FavoriteService } from './services/favorite.service';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService, FavoriteService, CommentService, PrismaService],
})
export class ArticleModule {}
