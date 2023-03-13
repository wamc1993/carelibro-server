import {
  Entity,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authorId: number;

  @ManyToOne((type) => User, (user) => user.comments, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  postId: number;

  @Column()
  message: string;

  @Column({
    nullable: true,
  })
  fatherId?: number;

  @Column()
  isActive: number;

  @OneToMany((type) => Comment, (children) => children.father)
  children: Comment[];

  @ManyToOne((type) => Comment, (parent) => parent.children)
  @JoinColumn({ name: 'fatherId' })
  father: Comment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
