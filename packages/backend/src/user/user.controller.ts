import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserInputRO, UserRO } from './user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get current user' })
  @Get()
  async current(): Promise<UserRO> {
    return await this.userService.findCurrentUser();
  }

  @ApiOperation({ summary: 'Update user' })
  @Put()
  async update(@Body() input: UpdateUserInputRO): Promise<UserRO> {
    return await this.userService.update(input.user);
  }
}
