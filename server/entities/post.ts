import { Length, IsNotEmpty, IsInt } from 'class-validator'
import { Expose } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Post{
  @PrimaryGeneratedColumn()
  @Expose()
  private id!: number;

  @Column()
  @Expose()
  @IsInt()
  private owner_id: number;

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
  @Length(1, 1000)
  private message: string;

  public constructor(owner_id: number, category: string, message: string){
    this.owner_id = owner_id;
    this.category = category;
    this.message = message;
  }

  public getId() : number {
    return this.id;
  }

  public getOwner_id() : number {
    return this.owner_id;
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
