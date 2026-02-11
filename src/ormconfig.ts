import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import ConfigNames from './config-constants';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow<string>(ConfigNames.databaseHost),
  port: configService.getOrThrow<number>(ConfigNames.databasePort),
  database: configService.getOrThrow<string>(ConfigNames.databaseName),
  username: configService.getOrThrow<string>(ConfigNames.databaseUsername),
  password: configService.getOrThrow<string>(ConfigNames.databasePassword),
  synchronize: configService.getOrThrow<boolean>(ConfigNames.databaseSync),
  migrations: ['src/migrations/*.ts'],
  entities: ['**/entities/*.entity.ts'],
});
