import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Post } from './post';
import { Reply } from './reply';
import { Like } from './like';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  private id!: number;

  @Column()
  private avatar: string;

  @OneToMany(type => Post, post => post.getOwner)
  posts!: Post[];

  @OneToMany(type => Reply, reply => reply.getOwner)
  replies!: Reply[];

  @OneToMany(type => Like, like => like.getPost)
  likes!: Like[]

  public constructor(avatar: string) {
    this.avatar = avatar;
  }

  public getId(): number {
    return this.id;
  }

  public setAvatar(avatar: string) {
    this.avatar = avatar;
  }

  public getAvatar(): string {
    return this.avatar;
  }
}
