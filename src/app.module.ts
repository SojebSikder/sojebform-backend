// external imports
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

// internal imports
import appConfig from './config/app.config';
import { ThrottlerBehindProxyGuard } from './common/guard/throttler-behind-proxy.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
export class AppModule {}
