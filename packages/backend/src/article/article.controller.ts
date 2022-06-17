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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guards/jwt-auth.guard';
import {
  ArticleInputRO,
  ArticleQueryFilter,
  ArticleRO,
  ArticlesRO,
  FeedQueryFilter,
} from './dto/article.dto';
import { CommentRO, CommentsRO, CreateCommentInputRO } from './dto/comment.dto';
import { ArticleService } from './services/article.service';
import { CommentService } from './services/comment.service';
import { FavoriteService } from './services/favorite.service';

@ApiBearerAuth()
@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Get all articles' })
  @Get()
  async findAll(@Query() query: ArticleQueryFilter): Promise<ArticlesRO> {
    return await this.articleService.findAll(query);
  }

  @ApiOperation({ summary: 'Get feed articles' })
  @Get('feed')
  async getFeed(@Query() query: FeedQueryFilter): Promise<ArticlesRO> {
    return await this.articleService.findFeed(query);
  }

  @Public()
  @ApiOperation({ summary: 'Get one articles' })
  @Get(':slug')
  async findOne(
    @Param('slug')
    slug: string,
  ): Promise<ArticleRO> {
    return await this.articleService.findOne(slug);
  }

  @Public()
  @ApiOperation({ summary: 'Get all comments of the article' })
  @Get(':slug/comments')
  async findComments(@Param('slug') slug: string): Promise<CommentsRO> {
    return await this.commentService.findComments(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  async create(@Body() input: ArticleInputRO): Promise<ArticleRO> {
    return this.articleService.create(input.article);
  }

  @ApiOperation({ summary: 'Update the article' })
  @Put(':slug')
  async update(
    @Param('slug') slug: string,
    @Body() input: ArticleInputRO,
  ): Promise<ArticleRO> {
    return this.articleService.update(slug, input.article);
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Delete the article' })
  async delete(@Param('slug') slug: string) {
    return this.articleService.delete(slug);
  }

  @Post(':slug/comments')
  @ApiOperation({ summary: 'Create a comment on the article' })
  async createComment(
    @Param('slug') slug: string,
    @Body() input: CreateCommentInputRO,
  ): Promise<CommentRO> {
    return await this.commentService.addComment(slug, input.comment);
  }

  @ApiOperation({ summary: 'Delete the comment' })
  @Delete(':slug/comments/:id')
  async deleteComment(@Param('slug') slug: string, @Param('id') id: number) {
    return await this.commentService.deleteComment(slug, id);
  }

  @ApiOperation({ summary: 'Add the article to favorites' })
  @Post(':slug/favorite')
  async favorite(@Param('slug') slug: string): Promise<ArticleRO> {
    return await this.favoriteService.favorite(slug);
  }

  @ApiOperation({ summary: 'Remove the article from favorites' })
  @Delete(':slug/favorite')
  async unfavorite(@Param('slug') slug: string): Promise<ArticleRO> {
    return await this.favoriteService.unfavorite(slug);
  }
}
