import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class UserData {
  email: string;
  username: string;
  bio: string;
  image: string;
}

export class UserRO {
  user: UserData;
}

export class UpdateUserInput {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  readonly email?: string;

  @IsNotEmpty()
  @IsOptional()
  readonly username?: string;

  @IsNotEmpty()
  @IsOptional()
  readonly bio?: string;

  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  readonly image?: string;

  @IsNotEmpty()
  @IsOptional()
  readonly password?: string;
}

export class UpdateUserInputRO {
  @ValidateNested()
  @Type(() => UpdateUserInput)
  user: UpdateUserInput;
}

export const userSelect = () => {
  return Prisma.validator<Prisma.UserSelect>()({
    email: true,
    username: true,
    bio: true,
    image: true,
  });
};
