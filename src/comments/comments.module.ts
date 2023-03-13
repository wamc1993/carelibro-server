import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { JwtStrategy } from '../common/guards/jwt.auth';

import { Comment } from './entities/comment.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UsersModule, PostsModule],
  controllers: [CommentsController],
  providers: [CommentsService, JwtStrategy],
})
export class CommentsModule {}
