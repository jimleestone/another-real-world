import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/guards/jwt-auth.guard';
import { ProfileRO } from './profile.interface';
import { ProfileService } from './profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Public()
  @Get(':username')
  async getProfile(@Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.findProfile(username);
  }

  @Post(':username/follow')
  async follow(@Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.follow(username);
  }

  @Delete(':username/follow')
  async unFollow(@Param('username') username: string): Promise<ProfileRO> {
    return await this.profileService.unFollow(username);
  }
}
