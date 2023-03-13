import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToInstance } from 'class-transformer';
import { Injectable, BadRequestException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private usersService: UsersService,
  ) {}

  async create(dto: CreatePostDto): Promise<Post> {
    const exists = await this.usersService.findOne(dto.authorId);
    if (!exists?.id) {
      throw new BadRequestException();
    }

    dto.relatedCommentsCount = 0;
    const newPost = this.postsRepository.create(dto);
    const result = await this.postsRepository.save(newPost);

    return this.findOne(result.id);
  }

  async findAll(): Promise<Post[]> {
    const posts = await this.postsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
    return instanceToInstance(posts);
  }

  findByAuthor(authorId: number): Promise<Post[]> {
    return this.postsRepository.find({ where: { authorId } });
  }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOneBy({ id });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    return this.postsRepository.save({ ...post, ...updatePostDto });
  }

  async updateRelatedComments(id: number): Promise<Post> {
    const post = await this.findOne(id);
    return this.postsRepository.save({
      ...post,
      relatedCommentsCount: post.relatedCommentsCount + 1,
    });
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    return this.postsRepository.remove(post);
  }
}
