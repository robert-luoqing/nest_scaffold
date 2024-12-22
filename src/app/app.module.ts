import { ExampleModule } from './../example/example.module';
import { UploadModule } from './../common/file/file.module';
import { RedisModule } from '../common/redis/redis.module';
import { UserModule } from './../user/user.module';
import { ConfigModule } from '../common/config/config.module';
import { ConfigService } from '../common/config/config.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../common/auth/auth.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // 引入 ConfigModule
      useFactory: (configService: ConfigService) => {
        console.log('dbconfig', configService.databaseConfig);
        return {
          type: 'mysql',
          host: configService.databaseConfig.host,
          port: configService.databaseConfig.port,
          username: configService.databaseConfig.username,
          password: configService.databaseConfig.password,
          database: configService.databaseConfig.name,
          entities: [__dirname + '/../**/*.entity.{js,ts}'], // 自动加载实体
          synchronize: configService.databaseConfig.synchronize, // 在开发环境中使用，生产环境建议关闭
          logging: configService.databaseConfig.logging,
        };
      },
      inject: [ConfigService], // 注入 ConfigService
    }),
    ClientsModule.register([
      {
        name: 'REDIS_CLIENT',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    ExampleModule,
    UserModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
