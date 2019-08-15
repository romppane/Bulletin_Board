import { PrimaryGeneratedColumn, Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsInt, MaxLength, Min } from 'class-validator';
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

  public constructor(user: User, post: Post, message: string, userId?: number, postId?: number) {
    this.user = user;
    this.post = post;
    this.message = message;
  }

  public getOwner(): User {
    return this.user;
  }

  public getPost(): Post {
    return this.post;
  }

  public getId(): number {
    return this.id;
  }

  public getUser_id(): number {
    return this.userId;
  }

  public getPost_id(): number {
    return this.postId;
  }

  public setMessage(message: string) {
    this.message = message;
  }

  public getMessage(): string {
    return this.message;
  }
}