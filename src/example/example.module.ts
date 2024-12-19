import { ConfigService } from '../common/config/config.service';
import { ConfigModule } from '../common/config/config.module';
import { Module } from '@nestjs/common';
import { ScheduleTaskService } from './scheduleTask.service';
import { queueTaskProcessor } from './queueTask.processor';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.redisConfig.host,
          port: configService.redisConfig.port,
          password: configService.redisConfig.password,
        },
        prefix: configService.redisConfig.bullKeyPrefix,
      }),
      inject: [ConfigService],
    }),

    BullModule.registerQueue({
      name: 'task-sample-queue', // 队列名称
    }),
  ],
  controllers: [],
  providers: [ScheduleTaskService, queueTaskProcessor],
})
export class ExampleModule {}
