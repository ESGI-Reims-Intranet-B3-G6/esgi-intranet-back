import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err, user, info: { message?: string }) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      if ((err as { message: string })?.message === 'Refresh token is not valid') {
        throw new UnauthorizedException('Unauthorized', {
          cause: {
            cause: (err as { message: string }).message,
          },
        });
      }
      if (info?.message === 'No auth token' || info?.message === 'jwt malformed' || info?.message === 'jwt expired') {
        throw new UnauthorizedException('Unauthorized', {
          cause: {
            cause: info.message,
          },
        });
      }

      throw err || new UnauthorizedException();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user;
  }
}
