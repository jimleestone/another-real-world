import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [ArticleModule, UserModule, AuthModule, ProfileModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
