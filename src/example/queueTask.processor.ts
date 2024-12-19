import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('task-sample-queue')
export class queueTaskProcessor {
  @Process('task-name')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleTask(job: Job) {
    // 处理任务
    // console.log('处理任务:', job.data);
  }
}
