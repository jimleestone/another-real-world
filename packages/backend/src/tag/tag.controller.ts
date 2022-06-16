import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guards/jwt-auth.guard';
import { TagService } from './tag.service';
@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @ApiOperation({ summary: 'Get all tags' })
  @Get()
  async findAll(): Promise<string[]> {
    return await this.tagService.findAll();
  }
}
