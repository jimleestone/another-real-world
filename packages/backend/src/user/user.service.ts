import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';
import { UpdateUserInput, userSelect } from './user.interface';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @Inject(REQUEST) private readonly req: { user: { id: number } },
    private prisma: PrismaService,
  ) {}

  async findAll(): Promise<any[]> {
    return await this.prisma.user.findMany({ select: userSelect() });
  }

  async create(data: any): Promise<any> {
    let user;
    try {
      user = await this.prisma.user.create({
        data,
        select: { id: true, ...userSelect() },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('Duplicate username or email');
      }
    }

    return user;
  }

  async update(data: UpdateUserInput): Promise<any> {
    const origin = await this.prisma.user.findUnique({
      where: { id: this.req.user.id },
    });
    if (!origin) throw new NotFoundException('user not found');

    let user;
    try {
      user = await this.prisma.user.update({
        where: { id: this.req.user.id },
        data,
        select: userSelect(),
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('Duplicate username or email');
      }
    }

    return { user };
  }

  async delete(username: string): Promise<void> {
    const origin = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!origin) throw new NotFoundException('user not found');

    await this.prisma.user.delete({
      where: { username },
      select: userSelect(),
    });
  }

  async findCurrentUser(): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: this.req.user.id },
      select: userSelect(),
    });
    return { user };
  }

  async findByEmail(email: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true, ...userSelect() },
    });
  }

  async findByUsername(username: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { username },
      select: { id: true, password: true, ...userSelect() },
    });
  }
}
