import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserInput {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}

export class CreateUserInput {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

export interface AuthPayload {
  user: string;
  sub: number;
}
