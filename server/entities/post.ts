import { Length, IsNotEmpty, IsInt, Min } from 'class-validator'
import { Expose } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, RelationId } from "typeorm";
import { User } from './user';

@Entity()
export class Post{
  @PrimaryGeneratedColumn()
  private id!: number;

  @ManyToOne(type => User, user => user.posts)
  @JoinColumn({ name: "ownerId" })
  private user: User;

  @Column({ nullable: false })
  private ownerId!: number;

  @Column({default : 0})
  private likes!: number;

  @Column()
  @Expose()
  @IsNotEmpty()
  @Length(1, 50)
  private category: string;

  @Column({default: 0})
  private views!: number;
  
  @Column("text")
  @Expose()
  @IsNotEmpty()
  @Length(1, 1000)
  private message: string;


  public constructor(user: User, category: string, message: string){
    this.user = user;
    this.category = category;
    this.message = message;
  }

  public getid() : number {
    return this.id;
  }

  public getOwner() : User {
    return this.user;
  }

  public getOwnerId() : number {
    return this.ownerId;
  }

  public addView() {
    this.views += 1;
  }

  public getViews() : number {
    return this.views;
  }

  // With this way of implementing likes, it's impossible to keep track of who likes the post or not.
  // Correct way to do this is probably with an extra table, but if you want to be able to like comments too, it's going to be a hastle!
  // Don't see the feature being the top priority now so I'll just let it be.
  public likePost() {
    this.likes += 1;
  }

  public unlikePost() {
    this.likes -= 1;
  }

  public getLikes() : number {
    return this.likes;
  }

  public setCategory(category:string) {
    this.category = category
  }

  public getCategory() : string {
    return this.category;
  }

  public setMessage(message:string) {
    this.message = message;
  }

  public getMessage() : string {
    return this.message;
  }


}
