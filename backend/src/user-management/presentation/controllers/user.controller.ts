import { Controller, Post, Body, Get, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user-management/application/dtos/user/create-user.dto';
import { UserService } from 'src/user-management/application/services/user.service';
import { ClerkAuthGuard } from 'src/shared/guards/clerk-auth-guard';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  // GET /users/me - get current user profile
  @UseGuards(ClerkAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    if (!req.user?._id) {
      throw new UnauthorizedException('User not authenticated');
    }
    return await this.userService.getUserById(req.user._id);
  }
}
