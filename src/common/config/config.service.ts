import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import {
  AppConfig,
  DatabaseConfig,
  FileConfig,
  RedisConfig,
} from './config.model';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get appConfig(): AppConfig {
    return {
      database: this.configService.get<DatabaseConfig>('database'),
      redis: this.configService.get<RedisConfig>('redis'),
      file: this.configService.get<FileConfig>('file'),
    };
  }

  get databaseConfig(): DatabaseConfig {
    return this.appConfig.database;
  }

  get redisConfig(): RedisConfig {
    return this.appConfig.redis;
  }

  get fileConfig(): FileConfig {
    return this.appConfig.file;
  }
}
