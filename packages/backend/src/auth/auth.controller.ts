import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserInput, LoginUserInput } from './auth.interface';
import { AuthService } from './auth.service';
import { Public } from './guards/jwt-auth.guard';

@Public()
@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body('user') input: LoginUserInput) {
    return this.authService.login(input);
  }

  @Post()
  async signup(@Body('user') input: CreateUserInput) {
    return this.authService.signup(input);
  }
}
