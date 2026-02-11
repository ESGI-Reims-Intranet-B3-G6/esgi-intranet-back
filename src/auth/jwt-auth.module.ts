import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt-auth.service';
import { JwtAuthStrategy } from './strategies/jwt.strategy';
import { JwtRefreshAuthStrategy } from './strategies/jwt-refresh.strategy';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule, UsersModule],
  providers: [JwtAuthStrategy, JwtRefreshAuthStrategy, JwtAuthService, AuthService],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
