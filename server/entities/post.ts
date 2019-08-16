import { Length, IsNotEmpty, IsInt, Min, IsEnum } from 'class-validator';
import { Expose } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './user';
import { Comment } from './comment';

export enum Categories {
  Default = 'default',
  Other = 'other'
}

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

  @Column('enum', { enum: Categories, default: Categories.Default })
  @IsEnum(Categories)
  @Expose()
  private category: Categories;

  @Column()
  @Expose()
  @IsNotEmpty()
  @Length(1, 50)
  private title: string;

  @Column({ default: 0 })
  private views!: number;

  @Column('text')
  @Expose()
  @IsNotEmpty()
  @Length(1, 1000)
  private message: string;

  @OneToMany(() => Comment, comment => comment.getPost)
  comments!: Comment[];

  @CreateDateColumn({ type: 'timestamp' })
  private createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  private updatedAt!: Date;

  public constructor(
    user: User,
    title: string,
    message: string,
    category: Categories,
    ownerId?: number
  ) {
    this.user = user;
    this.title = title;
    this.message = message;
    this.category = category;
  }

  public getOwner(): User {
    return this.user;
  }

  public addView() {
    this.views += 1;
  }
}
