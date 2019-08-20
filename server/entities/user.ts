import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from './post';
import { Comment } from './comment';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  private id!: number;

  @Column()
  private avatar: string;

  @OneToMany(type => Post, post => post.getOwner)
  posts!: Post[];

  @OneToMany(type => Comment, comment => comment.getOwner)
  comments!: Comment[];

  public constructor(avatar: string) {
    this.avatar = avatar;
  }

  public setAvatar(avatar: string) {
    this.avatar = avatar;
  }
}
