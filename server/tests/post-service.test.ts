import { mock, instance, when, verify, deepEqual, spy, resetCalls } from 'ts-mockito';
import { Dependencies } from '../types';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Post } from '../entities/post';
import { PostService } from '../service/post-service';
import { User } from '../entities/user';
import { UserService } from '../service/user-service';

const postRepository = <Repository<Post>>mock(Repository);
const repoInstance = instance(postRepository);
const service = new PostService(<Dependencies>{ postRepository: repoInstance });
const user = new User('test');
const testPost = new Post(user, 'category', 'message', 1);

const userRepository = <Repository<User>>mock(Repository);
const userRepoInstance = instance(userRepository);
const userService = new UserService({ userRepository: userRepoInstance } as Dependencies);
const userServiceSpy = spy(userService);

beforeEach(() => {
  resetCalls(postRepository);
  resetCalls(userRepository);
});

test('Fetch empty collection of posts', async () => {
  expect.assertions(1);

  when(postRepository.find()).thenResolve(new Array<Post>());

  const collection = await service.find();
  expect(collection).toStrictEqual([]);

  verify(postRepository.find()).called();
});

test('Fetch a post that exists', async () => {
  expect.assertions(1);

  when(postRepository.findOne(2)).thenResolve(testPost);

  const post = await service.findOne(2);
  expect(post).toStrictEqual(testPost);

  verify(postRepository.findOne(2)).called();
});

test("Fetch a post that doesn't exist", async () => {
  expect.assertions(1);

  when(postRepository.findOne(99)).thenResolve(undefined);

  const post = await service.findOne(99);
  expect(post).toBe(undefined);

  verify(postRepository.findOne(99)).called();
});

test('Delete post that exists', async () => {
  expect.assertions(1);

  let results = new DeleteResult();
  results.affected = 1;

  when(postRepository.delete(2)).thenResolve(results);

  const deleted = await service.delete(2);
  expect(deleted.affected).toBe(1);

  verify(postRepository.delete(2)).called();
});

test("Delete post that doesn't exist", async () => {
  expect.assertions(1);

  let results = new DeleteResult();
  results.affected = 0;

  when(postRepository.delete(99)).thenResolve(results);

  const deleted = await service.delete(99);
  expect(deleted.affected).toBe(0);

  verify(postRepository.delete(99)).called();
});

test('Update post that exists', async () => {
  expect.assertions(1);

  let results = new UpdateResult();
  when(postRepository.update(2, deepEqual(testPost))).thenResolve(results);
  when(postRepository.findOne(2)).thenResolve(testPost);

  const result = await service.update(2, testPost);
  expect(result).toStrictEqual(testPost);

  verify(postRepository.update(2, deepEqual(testPost))).called();
  verify(postRepository.findOne(2)).called();
});

test("Update post that doesn't exist", async () => {
  expect.assertions(1);

  let results = new UpdateResult();
  when(postRepository.update(99, deepEqual(testPost))).thenResolve(results);
  when(postRepository.findOne(99)).thenResolve(undefined);

  const result = await service.update(99, testPost);
  expect(result).toBe(undefined);

  verify(postRepository.update(99, deepEqual(testPost))).called();
  verify(postRepository.findOne(99)).called();
});

test('Save a new post', async () => {
  expect.assertions(1);

  when(postRepository.save(deepEqual(testPost))).thenResolve(testPost);
  when(userRepository.findOne(1)).thenResolve(user);

  const result = await service.save(1, 'category', 'message', userService);
  expect(result).toStrictEqual(testPost);

  verify(postRepository.save(deepEqual(testPost))).called();
  verify(userServiceSpy.findOne(1)).called();
});

test('Fail saving post because of no user', async () => {
  expect.assertions(1);

  when(userRepository.findOne(1)).thenResolve(undefined);

  const result = await service.save(1, 'category', 'message', userService);
  expect(result).toBe(undefined);

  verify(userServiceSpy.findOne(1)).called();
});
