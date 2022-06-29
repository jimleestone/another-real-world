import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaService } from '../shared/services/prisma.service';
import { ProfileRO, profileSelect, profileWrapper } from './profile.dto';

@Injectable({ scope: Scope.REQUEST })
export class ProfileService {
  constructor(
    @Inject(REQUEST) private readonly req: { user: { id: number } },
    private prisma: PrismaService,
  ) {}

  async findProfile(username: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: profileSelect(this.req.user.id),
    });
    if (!user) throw new NotFoundException('User not found');

    const profile = this.prisma.wrapResults(user, profileWrapper);
    return { profile };
  }

  async follow(username: string): Promise<any> {
    const following = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!following) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: this.req.user.id },
      data: {
        following: {
          create: [{ following: { connect: { id: following.id } } }],
        },
      },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: following.id },
      select: profileSelect(this.req.user.id),
    });

    const profile = this.prisma.wrapResults(user, profileWrapper);
    return { profile };
  }

  async unFollow(username: string): Promise<ProfileRO> {
    const following = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!following) throw new NotFoundException('User not found');

    await this.prisma.user.update({
      where: { id: this.req.user.id },
      data: {
        following: {
          delete: {
            followerId_followingId: {
              followerId: this.req.user.id,
              followingId: following.id,
            },
          },
        },
      },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: following.id },
      select: profileSelect(this.req.user.id),
    });

    const profile = this.prisma.wrapResults(user, profileWrapper);
    return { profile };
  }
}
