import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  private id!: number;

  @Column()
  private avatar: string;

  public constructor(avatar: string){
    this.avatar = avatar;
  }

  public getId() : number {
    return this.id;
  }

  public setAvatar(avatar : string) {
    this.avatar = avatar;
  }

  public getAvatar() : string {
    return this.avatar;
  }
}
