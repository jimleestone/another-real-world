import { Prisma } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export interface UserData {
  username: string;
  email: string;
  token?: string;
  bio: string;
  image?: string;
  id: number;
}

export interface UserRO {
  user: UserData;
}

export class UpdateUserInput {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  readonly bio: string;
  readonly image: string;
}

export const userSelect = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    email: true,
    username: true,
    bio: true,
    image: true,
  });
};
