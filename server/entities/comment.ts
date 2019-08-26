import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { IsInt, MaxLength, Min, Length, IsString } from 'class-validator';
import { Expose } from 'class-transformer';
import { User } from './user';
import { Post } from './post';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  private id!: number;

  @ManyToOne(type => User, user => user.comments)
  @JoinColumn({ name: 'userId' })
  private user!: User;

  @Column({ nullable: false })
  @Expose()
  @IsInt()
  @Min(1)
  private userId!: number;

  @ManyToOne(type => Post, post => post.comments)
  @JoinColumn({ name: 'postId' })
  private post: Post;

  @Column({ nullable: false })
  @Expose()
  @IsInt()
  @Min(1)
  private postId!: number;

  @Column('text')
  @Expose()
  @MaxLength(500)
  private message: string;

  @Column({ length: 18 })
  @Expose()
  @IsString()
  @Length(1, 18)
  private username: string;

  @CreateDateColumn({ type: 'timestamp' })
  private createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  private updatedAt!: Date;

  public constructor(
    user: User,
    post: Post,
    message: string,
    username: string,
    userId?: number,
    postId?: number
  ) {
    this.user = user;
    this.post = post;
    this.message = message;
    this.username = username;
  }

  public getOwner(): User {
    return this.user;
  }

  public getPost(): Post {
    return this.post;
  }
}
