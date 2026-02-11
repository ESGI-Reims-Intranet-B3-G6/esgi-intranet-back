import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import ConfigConstants from '../../config-constants';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { PassportMicrosoftProfile } from '../passport-microsoft-profile';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService
  ) {
    super({
      tenant: configService.getOrThrow(ConfigConstants.skolaeMicrosoftTenantId),
      clientID: configService.getOrThrow(ConfigConstants.entraAppId),
      clientSecret: configService.getOrThrow(ConfigConstants.entraAppSecret),
      callbackURL: configService.getOrThrow(ConfigConstants.entraAppCallbackUrl),
      scope: ['user.read'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: PassportMicrosoftProfile,
    done: (err: any, user: any) => void
  ) {
    return this.authService.validateUserForAuth({
      accessToken,
      refreshToken,
      profile,
      done,
    });
  }

  authenticate(req: Request, options?: any): void {
    super.authenticate(req, {
      ...options,
      failureRedirect: '/',
      prompt: 'select_account',
    });
  }
}
