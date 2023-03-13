import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @ManyToOne((type) => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  message: string;

  @Column()
  relatedCommentsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
