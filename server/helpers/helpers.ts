import { Post } from '../entities/post';
export function comparePosts(m1 : Post, m2 : Post) {
  return JSON.stringify(m1) === JSON.stringify(m2);
}
