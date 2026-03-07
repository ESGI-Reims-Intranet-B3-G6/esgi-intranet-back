import { Body, Controller, Get, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from './entities/user.entity';
import { UserAdminGuard } from './guards/user-admin-guard';
import { UsersService } from './users.service';
import { CreateUserRequestDto } from './dto';

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

  @Post('')
  @UseGuards(JwtAuthGuard, UserAdminGuard)
  async createUser(@CurrentUser() user: User, @Body() body: CreateUserRequestDto) {
    if (body.userRole === 'SUPERADMIN' && user.userRole === 'ADMIN') {
      throw new UnauthorizedException("Admins can't create Superadmins");
    }

    if (body.userRole === 'ADMIN' && user.userRole === 'ADMIN') {
      throw new UnauthorizedException('Only Superadmins can create Admins');
    }

    return await this.usersService.createUser({
      email: body.email,
      userRole: body.userRole ?? 'ETUDIANT',
    });
  }
}
