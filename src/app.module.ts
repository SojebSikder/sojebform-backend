// external imports
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// internal imports
import appConfig from './config/app.config';
import { ThrottlerBehindProxyGuard } from './common/guard/throttler-behind-proxy.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlGeneratorModule } from 'nestjs-url-generator';
import { PrismaModule } from './providers/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AbilityModule } from './providers/ability/ability.module';
import { MailModule } from './providers/mail/mail.module';
import { CheckoutModule } from './modules/app/checkout/checkout.module';
import { BillingModule } from './modules/app/organization/billing/billing.module';
import { PlanModule } from './modules/app/plan/plan.module';
import { ProfileModule } from './modules/app/profile/profile.module';
import { PermissionModule } from './modules/app/space/permission/permission.module';
import { SpaceRoleModule } from './modules/app/space/space-role/space-role.module';
import { WorkspaceUserModule } from './modules/app/space/workspace-user/workspace-user.module';
import { WorkspaceModule } from './modules/app/space/workspace/workspace.module';
import { StripeModule } from './modules/app/stripe/stripe.module';
import { UserModule } from './modules/app/user/user.module';
import { ExampleModule } from './modules/example/example.module';
import { TenantModule } from './modules/su-admin/tenant/tenant.module';
import { SocketModule } from './providers/socket/socket.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { RawBodyMiddleware } from './common/middleware/rawBody.middleware';
import { FormModule } from './modules/app/form/form.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ThrottlerModule.forRoot({
      // ttl: 60,
      // limit: 10,
      throttlers: [
        {
          name: 'default',
          ttl: 60,
          limit: 10,
        },
        {
          name: 'user',
          ttl: 60,
          limit: 10,
        },
      ],
    }),
    UrlGeneratorModule.forRoot({
      secret: appConfig().app.key,
      appUrl: appConfig().app.url,
    }),
    // General modules
    PrismaModule,
    AuthModule,
    AbilityModule,
    MailModule,
    SocketModule,
    // Super admin modules
    TenantModule,
    // app modules
    UserModule,
    ProfileModule,
    WorkspaceUserModule,
    PermissionModule,
    StripeModule,
    BillingModule,
    SpaceRoleModule,
    ExampleModule,
    WorkspaceModule,
    PlanModule,
    CheckoutModule,
    FormModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },

    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    // for the raw body
    consumer.apply(RawBodyMiddleware).forRoutes('*');
  }
}
