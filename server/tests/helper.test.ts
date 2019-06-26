import { comparePosts } from '../helpers/helpers';
import { Post } from '../entities/post';

const p : Post = new Post(0,0,"cat","dog");
const o : Post = new Post(0,0,"cat","doggo");

test('compares two json objects to each other expecting true', () => {
  expect(comparePosts(p, p)).toBe(true);
});
test('compares two json objects to each other expecting false', () => {
  expect(comparePosts(p, o)).toBe(false);
});
