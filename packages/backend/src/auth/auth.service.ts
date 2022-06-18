import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Utility from 'src/shared/utils';
import { UserService } from 'src/user/user.service';
import { AuthPayload, CreateUserInput, LoginUserInput } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(input: LoginUserInput) {
    let user = await this.usersService.findByUsername(input.username);
    if (!user) {
      user = await this.usersService.findByEmail(input.username);
    }
    if (!user || !Utility.checkPassword(input.password, user.password)) {
      throw new BadRequestException('Bad credentials');
    }

    delete user['password'];
    const { id, ...ret } = user;
    const payload = { user: user.username, sub: id };
    return {
      user: {
        ...ret,
        token: this.jwtService.sign(payload),
      },
    };
  }

  async signup(input: CreateUserInput) {
    const encoded = Utility.encodePassword(input.password);
    const user = await this.usersService.create({
      ...input,
      password: encoded,
    });
    const { id, ...ret } = user;
    const payload: AuthPayload = { user: user.username, sub: id };
    return {
      user: {
        ...ret,
        token: this.jwtService.sign(payload),
      },
    };
  }
}
