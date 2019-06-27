import { Post } from '../entities/post';
export function comparePosts(m1 : Post, m2 : Post) {
  return JSON.stringify(m1) === JSON.stringify(m2);
}

export function limitResponces (responces : any[], limit : number) : any[]{
  if(limit>0) {
    return responces.slice(0, limit);
  }
  else{
    return responces;
  }
}
