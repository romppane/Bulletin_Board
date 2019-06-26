export class Reply {
  private id: number;
  private user_id: number;
  private post_id: number;
  private likes: number;
  private message: string;

  public constructor(id: number, user_id: number, post_id: number, message: string){
    // Will be replaced by autogeneration
    this.id = id;
    this.user_id = user_id;
    this.post_id = post_id;
    this.likes = 0;
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
