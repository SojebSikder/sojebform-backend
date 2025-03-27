import { Module } from '@nestjs/common';
import { FormModule } from './form/form.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [FormModule, SubmissionModule],
})
export class SpaceModule {}
