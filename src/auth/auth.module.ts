import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { MicrosoftStrategy } from './strategies/microsoft.strategy';
import { JwtAuthModule } from './jwt-auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PassportModule.register({ session: true }), JwtAuthModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, MicrosoftStrategy],
})
export class AuthModule {}
