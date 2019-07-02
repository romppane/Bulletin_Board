import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class Reply {

  @PrimaryGeneratedColumn()
  private id!: number;
  @Column()
  private user_id: number;
  @Column()
  private post_id: number;
  @Column({ default: 0 })
  private likes!: number;
  @Column("text")
  private message: string;

  public constructor(user_id: number, post_id: number, message: string){
    this.user_id = user_id;
    this.post_id = post_id;
    this.message = message;
  }

  public getId() : number {
    return this.id;
  }

  public getUser_id() : number {
    return this.user_id;
  }

  public getPost_id() : number {
    return this.post_id;
  }

  public likeReply() {
    this.likes += 1;
  }

  public unlikeReply() {
    this.likes -= 1;
  }

  public getLikes() : number {
    return this.likes;
  }

  public setMessage(message: string) {
    this.message = message;
  }

  public getMessage() : string {
    return this.message;
  }


}
