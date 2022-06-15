import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UserService } from 'src/user/user.service';
import { AuthPayload, CreateUserInput, LoginUserInput } from './auth.interface';

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
    if (!user || !bcrypt.compareSync(input.password, user.password)) {
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
    const encoded = bcrypt.hashSync(input.password, bcrypt.genSaltSync(10));
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
