import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

import { Comment } from '../../comments/entities/comment.entity';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class User {
  @Expose({ groups: ['withUserId'] })
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Expose({ groups: ['withDates'] })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: ['withDates'] })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
