import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  providers: [TagService, PrismaService],
  controllers: [TagController],
})
export class TagModule {}
