import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/guards/jwt-auth.guard';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Get()
  async findAll(): Promise<any[]> {
    return await this.tagService.findAll();
  }
}
