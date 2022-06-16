import { ForbiddenException, NotFoundException } from '@nestjs/common';
import {
  commentSelect,
  commentWrapper,
  CreateCommentInput,
} from '../dto/comment.dto';
import { BaseArticleService } from './base-article.service';

export class CommentService extends BaseArticleService {
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
}
