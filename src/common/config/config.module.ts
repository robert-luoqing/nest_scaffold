import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      isGlobal: true,
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
