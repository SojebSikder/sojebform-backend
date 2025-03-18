import { Module } from '@nestjs/common';
import { NotificationModule } from './notification/notification.module';
import { ContactModule } from './contact/contact.module';
import { FaqModule } from './faq/faq.module';
import { FormModule } from './form/form.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
  imports: [NotificationModule, ContactModule, FaqModule, FormModule, SubmissionModule],
})
export class ApplicationModule {}
