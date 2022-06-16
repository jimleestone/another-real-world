import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guards/jwt-auth.guard';
import { ProfileRO } from './profile.dto';
import { ProfileService } from './profile.service';

@ApiBearerAuth()
@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @ApiOperation({ summary: `Get a user's profile` })
  @Get(':username')
  async getProfile(@Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.findProfile(username);
  }

  @ApiOperation({ summary: 'Follow the user' })
  @Post(':username/follow')
  async follow(@Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.follow(username);
  }
  @ApiOperation({ summary: 'Stop following the user' })
  @Delete(':username/follow')
  async unFollow(@Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.unFollow(username);
  }
}
