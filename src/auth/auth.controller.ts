import { Controller, Get, HttpException, Req, Res, UseGuards } from '@nestjs/common';
import { MicrosoftAuthGuard } from './guards/microsoft-auth.guard';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtAuthService } from './jwt-auth.service';
import { PassportMicrosoftProfile } from './passport-microsoft-profile';
import { UsersService } from '../users';
import { CurrentUser } from './current-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private usersService: UsersService
  ) {}

  @Get('login')
  @UseGuards(MicrosoftAuthGuard)
  login() {}

  @Get('microsoft')
  @UseGuards(MicrosoftAuthGuard)
  async callback(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    try {
      const passportUser = request.user as PassportMicrosoftProfile;
      const user = await this.usersService.createOrUpdateUser(passportUser);
      await this.jwtAuthService.login(user, response);

      console.log('User logged in:', user.id);
    } catch (error) {
      console.log(error);

      if (error instanceof HttpException) {
        return {
          message: error.message,
          status: error.getStatus(),
          details: null,
        };
      }

      throw error;
    }
  }

  @Get('refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    await this.jwtAuthService.login(user, response, true);
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    await this.jwtAuthService.logout(user, response);
    console.log('User logged out:', user.id);
  }
}
