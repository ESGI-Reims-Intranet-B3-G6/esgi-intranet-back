import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import e, { Request } from 'express';
import ConfigConstants from '../../config-constants';
import { UsersService } from '../../users/users.service';

export type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.authentication as string | null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(ConfigConstants.jwtSecret)!,
    });
  }

  validate(payload: JwtPayload) {
    return this.usersService.getUserById(payload.sub);
  }

  authenticate(req: e.Request, options?: any) {
    super.authenticate(req, options);
  }
}
