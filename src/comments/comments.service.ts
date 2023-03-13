import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToInstance } from 'class-transformer';
import { Injectable, BadRequestException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';

import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private usersService: UsersService,
    private postsService: PostsService,
  ) {}

  async create(dto: CreateCommentDto): Promise<Comment> {
    const { authorId, postId, fatherId } = dto;

    const existsAuthor = await this.usersService.findOne(authorId);
    if (!existsAuthor?.id) {
      throw new BadRequestException();
    }

    const existsPost = await this.postsService.findOne(postId);
    if (!existsPost?.id) {
      throw new BadRequestException();
    }

    if (fatherId) {
      const existsFather = await this.findOne(fatherId);
      if (!existsFather?.id || existsFather.postId !== dto.postId) {
        throw new BadRequestException();
      }
    }

    dto.isActive = 1;
    const commentToSave = this.commentRepository.create(dto);
    const newComment = await this.commentRepository.save(commentToSave);
    await this.postsService.updateRelatedComments(newComment.postId);

    return newComment;
  }

  findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  findOne(id: number): Promise<Comment> {
    return this.commentRepository.findOneBy({ id });
  }

  async findByPostId(postId: number): Promise<Comment[]> {
    const comments = await this.commentRepository
      .createQueryBuilder('a')
      .where(`a.postId = :postId`, { postId })
      .andWhere('a.fatherId IS NULL')
      .innerJoinAndSelect('a.author', 'user')
      .leftJoinAndSelect('a.children', 'b')
      .leftJoinAndSelect('b.author', 'c')
      .orderBy('a.createdAt', 'ASC')
      .getMany();

    return instanceToInstance(comments);
  }

  async update(id: number, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id);
    return this.commentRepository.save({ ...comment, ...dto });
  }

  async remove(id: number) {
    const comment = await this.findOne(id);
    return this.commentRepository.remove(comment);
  }
}
