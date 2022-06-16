import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUserRO, CreateUserInputRO, LoginUserInputRO } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './guards/jwt-auth.guard';

@Public()
@ApiTags('authentication')
@Controller('users')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @Post('login')
  async login(@Body() input: LoginUserInputRO): Promise<AuthUserRO> {
    return await this.authService.login(input.user);
  }

  @ApiOperation({ summary: 'Signup' })
  @Post()
  async signup(@Body() input: CreateUserInputRO): Promise<AuthUserRO> {
    return await this.authService.signup(input.user);
  }
}
