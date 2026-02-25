import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportMicrosoftProfile } from './passport-microsoft-profile';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUserForAuth(args: {
    accessToken: string;
    refreshToken: string;
    profile: PassportMicrosoftProfile;
    done: (err: any, user: any) => void;
  }) {
    if (await this.usersService.isUserDisabled(args.profile.id)) {
      return args.done(new UnauthorizedException('User is disabled'), null);
    }

    return args.done(null, args.profile);
  }

  async verifyUserRefreshToken(userId: string, refreshToken: string): Promise<User> {
    const user = await this.usersService.getUserById(userId);
    if (!user || !user.refreshToken || !(await verify(user.refreshToken, refreshToken))) {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    return user;
  }
}
