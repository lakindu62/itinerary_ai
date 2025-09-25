import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from 'src/user-management/application/dtos/user/create-user.dto';
import { UserService } from 'src/user-management/application/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
}
