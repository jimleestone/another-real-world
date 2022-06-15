import { Body, Controller, Get, Put } from '@nestjs/common';
import { UpdateUserInput } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async current() {
    return await this.userService.findCurrentUser();
  }

  @Put()
  async update(@Body('user') input: UpdateUserInput) {
    return await this.userService.update(input);
  }
}
