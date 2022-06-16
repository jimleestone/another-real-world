import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
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
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly username: string;

  @IsOptional()
  @IsString()
  readonly bio: string;

  @IsOptional()
  @IsString()
  readonly image: string;

  @IsOptional()
  @IsString()
  readonly password: string;
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
