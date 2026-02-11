import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './strategies/jwt.strategy';
import { User } from '../users/entities/user.entity';
import { Response } from 'express';
import ConfigConstants from '../config-constants';
import { ConfigService } from '@nestjs/config';
import { hash } from 'argon2';
import { UsersService } from '../users';

@Injectable()
export class JwtAuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService
  ) {}

  async login(user: User, response: Response, isRefresh: boolean = false) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ConfigConstants.jwtSecret),
      expiresIn: `${this.configService.getOrThrow<number>(ConfigConstants.jwtExpiresInSeconds)}s`,
    });

    response.cookie('authentication', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: Number(this.configService.get(ConfigConstants.jwtExpiresInSeconds)) * 1000,
    });

    let refreshTokenExpirationSeconds = this.configService.getOrThrow<number>(ConfigConstants.jwtMaxSessionTimeSeconds);

    if (isRefresh) {
      const expirationDate = Math.floor(user.lastLogin.getTime() / 1000) + +refreshTokenExpirationSeconds;

      const currentDate = Math.floor(new Date().getTime() / 1000);
      refreshTokenExpirationSeconds = expirationDate - currentDate;
    }

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(ConfigConstants.jwtRefreshSecret),
      expiresIn: `${refreshTokenExpirationSeconds}s`,
    });

    const hashedRefreshToken = await hash(refreshToken);

    await this.usersService.updateRefreshToken(user.id, hashedRefreshToken);

    response.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: refreshTokenExpirationSeconds * 1000,
    });
  }

  async logout(user: User, response: Response) {
    response.cookie('authentication', null, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });

    response.cookie('refresh', null, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      expires: new Date(0),
    });

    await this.usersService.updateRefreshToken(user.id, null);
  }
}
