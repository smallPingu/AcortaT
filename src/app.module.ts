import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { UrlsModule } from './urls/urls.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    UrlsModule, 
    // 60 seg, 10 limite de peticiones
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}