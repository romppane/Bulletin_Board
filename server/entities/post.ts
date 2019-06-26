
export class Post{
  private id: number;
  private owner_id: number;
  private likes: number;
  private category: string;
  private views: number;
  private message: string;

  public constructor(id: number, owner_id: number, category: string, message: string){
    this.id = id;
    this.owner_id = owner_id;
    this.likes = 0;
    this.category = category;
    this.views = 0;
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
