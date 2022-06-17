import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, ValidateNested } from 'class-validator';
import { UserData } from 'src/user/user.dto';

export class LoginUserInput {
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  readonly password: string;
}

export class CreateUserInput {
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}

export interface AuthPayload {
  user: string;
  sub: number;
}

export class LoginUserInputRO {
  @ValidateNested()
  @Type(() => LoginUserInput)
  user: LoginUserInput;
}

export class CreateUserInputRO {
  @ValidateNested()
  @Type(() => CreateUserInput)
  user: CreateUserInput;
}

export class AuthUserData extends UserData {
  token: string;
}

export class AuthUserRO {
  user: AuthUserData;
}
