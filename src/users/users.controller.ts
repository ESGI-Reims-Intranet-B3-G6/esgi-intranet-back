import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './entities/user.entity';
import { UserAdminGuard } from './guards/user-admin-guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  userDetails(@CurrentUser() user: User) {
    return user.toPublic();
  }

  @Get('list')
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async listUsers() {
    return (await this.usersService.listUsers()).map((user) => user.toPublic());
  }
}
