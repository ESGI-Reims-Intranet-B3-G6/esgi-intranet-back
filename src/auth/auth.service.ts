import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportMicrosoftProfile } from './passport-microsoft-profile';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  validateUserForAuth(args: {
    accessToken: string;
    refreshToken: string;
    profile: PassportMicrosoftProfile;
    done: (err: any, user: any) => void;
  }) {
    // Supposedly, this validation is already done using Skolae's Microsoft tenant ID
    // Perhaps some other validation could be done
    if (!args.profile.userPrincipalName.endsWith('@myskolae.fr')) {
      return args.done(null, false);
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
