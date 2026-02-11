import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import ConfigNames from '../config-constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>(ConfigNames.databaseHost),
        port: configService.getOrThrow<number>(ConfigNames.databasePort),
        username: configService.getOrThrow<string>(ConfigNames.databaseUsername),
        password: configService.getOrThrow<string>(ConfigNames.databasePassword),
        database: configService.getOrThrow<string>(ConfigNames.databaseName),
        synchronize: configService.getOrThrow<boolean>(ConfigNames.databaseSync),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
