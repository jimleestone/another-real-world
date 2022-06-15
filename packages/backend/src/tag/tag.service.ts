import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<any> {
    const tags = await this.prisma.tag.findMany({
      select: {
        name: true,
        _count: {
          select: { articles: true },
        },
      },
      orderBy: {
        articles: {
          _count: 'desc',
        },
      },
    });

    const results = tags.map((t) => t.name);
    return { tags: results };
  }
}
