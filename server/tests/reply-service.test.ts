import { mock, instance, when, verify, deepEqual, reset } from 'ts-mockito';
import { Dependencies } from '../types';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Post } from '../entities/post';
import { Comment } from '../entities/comment';
import { CommentService } from '../service/comment-service';
import { User } from '../entities/user';

const commentRepository = <Repository<Comment>>mock(Repository);
const commentRepoInstance = instance(commentRepository);
const postRepository = <Repository<Post>>mock(Repository);
const postRepoInstance = instance(postRepository);
const userRepository = <Repository<User>>mock(Repository);
const userRepoInstance = instance(userRepository);

const service = new CommentService(<Dependencies>{
  commentRepository: commentRepoInstance,
  postRepository: postRepoInstance,
  userRepository: userRepoInstance
});
const user = new User('test');
const testPost = new Post(user, 'category', 'message', 1);
const testComment = new Comment(user, testPost, 'message');

beforeEach(() => {
  reset(commentRepository);
  reset(postRepository);
  reset(userRepository);
});

test('Fetch empty collection of comments', async () => {
  expect.assertions(1);

  when(commentRepository.find()).thenResolve(new Array<Comment>());

  const collection = await service.find();
  expect(collection).toStrictEqual([]);

  verify(commentRepository.find()).called();
});

test('Fetch a comment that exists', async () => {
  expect.assertions(1);

  when(commentRepository.findOne(2)).thenResolve(testComment);

  const comment = await service.findOne(2);
  expect(comment).toStrictEqual(testComment);

  verify(commentRepository.findOne(2)).called();
});

test("Fetch a comment that doesn't exist", async () => {
  expect.assertions(1);

  when(commentRepository.findOne(99)).thenResolve(undefined);

  const comment = await service.findOne(99);
  expect(comment).toBe(undefined);

  verify(commentRepository.findOne(99)).called();
});

test('Delete comment that exists', async () => {
  expect.assertions(1);

  let results = new DeleteResult();
  results.affected = 1;

  when(commentRepository.delete(2)).thenResolve(results);

  const deleted = await service.delete(2);
  expect(deleted.affected).toBe(1);

  verify(commentRepository.delete(2)).called();
});

test("Delete comment that doesn't exist", async () => {
  expect.assertions(1);

  let results = new DeleteResult();
  results.affected = 0;

  when(commentRepository.delete(99)).thenResolve(results);

  const deleted = await service.delete(99);
  expect(deleted.affected).toBe(0);

  verify(commentRepository.delete(99)).called();
});

test('Update comment that exists', async () => {
  expect.assertions(1);

  let results = new UpdateResult();

  when(commentRepository.update(2, deepEqual(testComment))).thenResolve(results);
  when(commentRepository.findOne(2)).thenResolve(testComment);

  const result = await service.update(2, testComment);
  expect(result).toStrictEqual(testComment);

  verify(commentRepository.update(2, deepEqual(testComment))).called();
  verify(commentRepository.findOne(2)).called();
});

test("Update comment that doesn't exist", async () => {
  expect.assertions(1);

  let results = new UpdateResult();

  when(commentRepository.update(99, deepEqual(testComment))).thenResolve(results);
  when(commentRepository.findOne(99)).thenResolve(undefined);

  const result = await service.update(99, testComment);
  expect(result).toBe(undefined);

  verify(commentRepository.update(99, deepEqual(testComment))).called();
  verify(commentRepository.findOne(99)).called();
});

test('Save a new comment', async () => {
  expect.assertions(1);

  when(commentRepository.save(deepEqual(testComment))).thenResolve(testComment);
  when(userRepository.findOne(1)).thenResolve(user);
  when(postRepository.findOne(1)).thenResolve(testPost);

  const result = await service.save(1, 1, 'message');
  expect(result).toStrictEqual(testComment);

  verify(postRepository.findOne(1)).called();
  verify(userRepository.findOne(1)).called();
  verify(commentRepository.save(deepEqual(testComment))).called();
});

test('Fail save because of missing user', async () => {
  expect.assertions(2);

  when(userRepository.findOne(2)).thenResolve(undefined);
  when(postRepository.findOne(2)).thenResolve(testPost);

  const foundUser = await service.userRepository.findOne(2);
  expect(foundUser).toBe(undefined);

  const foundPost = await service.postRepository.findOne(2);
  expect(foundPost).toStrictEqual(testPost);

  verify(userRepository.findOne(2)).called();
  verify(postRepository.findOne(2)).called();
});

test('Fail save because of missing post', async () => {
  expect.assertions(2);

  when(userRepository.findOne(1)).thenResolve(user);
  when(postRepository.findOne(1)).thenResolve(undefined);

  const foundUser = await service.userRepository.findOne(1);
  expect(foundUser).toStrictEqual(user);

  const foundPost = await service.postRepository.findOne(1);
  expect(foundPost).toBe(undefined);

  verify(userRepository.findOne(1)).called();
  verify(postRepository.findOne(1)).called();
});

test('Fail save because of missing post and user', async () => {
  expect.assertions(2);

  when(userRepository.findOne(1)).thenResolve(undefined);
  when(postRepository.findOne(1)).thenResolve(undefined);

  const foundUser = await service.userRepository.findOne(1);
  expect(foundUser).toBe(undefined);

  const foundPost = await service.postRepository.findOne(1);
  expect(foundPost).toBe(undefined);

  verify(userRepository.findOne(1)).called();
  verify(postRepository.findOne(1)).called();
});
