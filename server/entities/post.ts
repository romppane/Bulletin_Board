import { Length, IsNotEmpty, IsInt, Min } from 'class-validator';
import { Expose } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user';
import { Comment } from './comment';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  private id!: number;

  @ManyToOne(() => User, user => user.posts)
  @JoinColumn({ name: 'ownerId' })
  private user: User;

  @Column({ nullable: false })
  @Expose()
  @IsInt()
  @Min(1)
  private ownerId!: number;

  @Column('text')
  private category: Categories;

  @Column()
  @Expose()
  @IsNotEmpty()
  @Length(1, 50)
  private header: string;

  @Column({ default: 0 })
  private views!: number;

  @Column('text')
  @Expose()
  @IsNotEmpty()
  @Length(1, 1000)
  private message: string;

  @OneToMany(() => Comment, comment => comment.getPost)
  comments!: Comment[];

  public constructor(
    user: User,
    header: string,
    message: string,
    category: Categories,
    ownerId?: number
  ) {
    this.user = user;
    this.header = header;
    this.message = message;
    this.category = category;
  }

  public getid(): number {
    return this.id;
  }

  public getOwner(): User {
    return this.user;
  }

  public getOwnerId(): number {
    return this.ownerId;
  }

  public addView() {
    this.views += 1;
  }

  public getViews(): number {
    return this.views;
  }

  public setHeader(header: string) {
    this.header = header;
  }

  public getHeader(): string {
    return this.header;
  }

  public setMessage(message: string) {
    this.message = message;
  }

  public getMessage(): string {
    return this.message;
  }
}

export enum Categories {
  Default = 'default',
  Other = 'other'
}
