import { comparePosts, limitResponces, sortBy } from '../helpers/helpers';
import { Post } from '../entities/post';
import { User } from '../entities/user';

const p : Post = new Post(0,0,"cat","dog");
const o : Post = new Post(0,0,"cat","doggo");

const objectList : User[] = [new User("Zed"), new User("Bertta"), new User("Azim")];
const correctList : User[] = [new User("Azim"),new User("Bertta"), new User("Zed")];
//console.log(objectList);
//const sorted = sortByFieldAtoZ(objectList, "avatar");
//console.log(sorted);

const list : number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const strings : string[] = ["aa", "aaa", "aaaa", "bb", "bbb", "bbbb", "cc", "ccc", "cccc", "dd"];

test('compares two json objects to each other expecting true', () => {
  expect(comparePosts(p, p)).toBe(true);
});
test('compares two json objects to each other expecting false', () => {
  expect(comparePosts(p, o)).toBe(false);
});


test('takes in a list of 10 numbers, returns the list with just 5 objects from the top', () => {
  expect(limitResponces(list, 5)).toStrictEqual([0,1,2,3,4]);
})

test('takes in the a list of numbers, returns it unchanged because of an illegal paramater', () => {
  expect(limitResponces(list, -1)).toStrictEqual(list);
})

test('takes in a list of 10 strings, returns the 6 from the top', () => {
  expect(limitResponces(strings, 6)).toStrictEqual(["aa", "aaa", "aaaa", "bb", "bbb", "bbbb"]);
})

test('takes in a list of strings, expecting to return without changes', () => {
  expect(limitResponces(strings, 0)).toStrictEqual(strings);
})

test('takes in a list of 10 strings, expecting to return without changes', () => {
  expect(limitResponces(strings, 11)).toStrictEqual(["aa", "aaa", "aaaa", "bb", "bbb", "bbbb", "cc", "ccc", "cccc", "dd"]);
})

test('takes in a list of objects and returns it in a-z order by the column', () => {
  expect(sortBy(objectList, "avatar", "ascending")).toStrictEqual(correctList);
})
