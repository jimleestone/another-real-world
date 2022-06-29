import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { ArticleModule } from './article/article.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { ProfileModule } from './profile/profile.module';
import { RequestInterceptor } from './shared/interceptors/request.interceptor';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend', 'build'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('throttler.ttl'),
        limit: config.get<number>('throttler.limit'),
      }),
    }),
    ArticleModule,
    UserModule,
    AuthModule,
    ProfileModule,
    TagModule,
    ConfigModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
    },
  ],
})
export class AppModule {}
