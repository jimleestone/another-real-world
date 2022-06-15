import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Public } from 'src/auth/guards/jwt-auth.guard';
import {
  ArticleInput,
  ArticleQueryFilter,
  ArticleRO,
  ArticlesRO,
  CommentsRO,
  CreateCommentInput,
} from './article.interface';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @Public()
  async findAll(@Query() query: ArticleQueryFilter): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @Get('feed')
  async getFeed(@Query() query: ArticleQueryFilter): Promise<ArticlesRO> {
    return await this.articleService.findFeed(query);
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug): Promise<ArticleRO> {
    return await this.articleService.findOne(slug);
  }

  @Public()
  @Get(':slug/comments')
  async findComments(@Param('slug') slug: string): Promise<CommentsRO> {
    return await this.articleService.findComments(slug);
  }

  @Post()
  async create(@Body('article') input: ArticleInput) {
    return this.articleService.create(input);
  }

  @Put(':slug')
  async update(
    @Param('slug') slug: string,
    @Body('article') articleData: ArticleInput,
  ) {
    return this.articleService.update(slug, articleData);
  }

  @Delete(':slug')
  async delete(@Param('slug') slug: string) {
    return this.articleService.delete(slug);
  }

  @Post(':slug/comments')
  async createComment(
    @Param('slug') slug: string,
    @Body('comment') input: CreateCommentInput,
  ) {
    return await this.articleService.addComment(slug, input);
  }

  @Delete(':slug/comments/:id')
  async deleteComment(@Param('slug') slug: string, @Param('id') id: number) {
    return await this.articleService.deleteComment(slug, id);
  }

  @Post(':slug/favorite')
  async favorite(@Param('slug') slug: string) {
    return await this.articleService.favorite(slug);
  }

  @Delete(':slug/favorite')
  async unfavorite(@Param('slug') slug: string) {
    return await this.articleService.unfavorite(slug);
  }
}
