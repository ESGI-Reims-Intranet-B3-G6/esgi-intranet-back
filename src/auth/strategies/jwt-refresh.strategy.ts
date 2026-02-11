import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import ConfigConstants from '../../config-constants';
import { JwtPayload } from './jwt.strategy';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtRefreshAuthStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request.cookies?.refresh as string | null]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ConfigConstants.jwtRefreshSecret)!,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    return await this.authService.verifyUserRefreshToken(payload.sub, request.cookies?.refresh as string);
  }
}
