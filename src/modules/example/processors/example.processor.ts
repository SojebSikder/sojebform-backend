import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('message-queue')
export class ExampleProcessor {
  /**
   * process job
   * @param job
   * @returns
   */
  @Process('sendMessage')
  handleSendMessage(job: Job<unknown>) {
    console.log(job.data);
  }
}
