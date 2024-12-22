import { eventName, queueName } from './../common/model/eventName';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor(queueName.sample)
export class queueTaskProcessor {
  @Process(eventName.example)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleTask(job: Job) {
    // 处理任务
    // console.log('处理任务:', job.data);
  }
}
