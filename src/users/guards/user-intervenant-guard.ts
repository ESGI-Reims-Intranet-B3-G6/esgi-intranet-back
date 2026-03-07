import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Request } from 'express';

@Injectable()
export class UserIntervenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as User | undefined;

    if (!user || !user.userRole) {
      throw new UnauthorizedException('Unauthorized', { cause: { cause: 'User is missing' } });
    }

    return (
      user.userRole === 'INTERVENANT' || user.userRole === 'ADMIN' || user.userRole === 'SUPERADMIN'
    );
  }
}
