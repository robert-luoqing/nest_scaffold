import { eventName, queueName } from './../common/model/eventName';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ScheduleTaskService {
  constructor(@InjectQueue(queueName.sample) private taskQueue: Queue) {}

  // 使用 Cron 表达式，每天凌晨 2 点执行一次
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  handleCron() {
    console.log('执行定时任务: 每天凌晨 2 点');
  }

  // 每 10 秒执行一次
  @Interval(10000)
  handleInterval() {
    // console.log('每 10 秒执行一次');
  }

  // 应用启动 5 秒后执行一次
  @Timeout(5000)
  handleTimeout() {
    // console.log('启动 5 秒后执行的任务');
  }

  @Interval(10000)
  async handleCronQueue() {
    // 将任务放入队列
    await this.taskQueue.add(eventName.example, {
      someData: 'data to process',
    });
  }
}
