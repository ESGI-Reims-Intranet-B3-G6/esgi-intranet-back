import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule, AuthModule, JwtAuthModule, UsersModule } from './';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, AuthModule, JwtAuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
