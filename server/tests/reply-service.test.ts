import { mock, instance, when, verify, deepEqual, reset } from 'ts-mockito';
import { Dependencies } from '../types';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Post } from '../entities/post';
import { Reply } from '../entities/reply';
import { ReplyService } from '../service/reply-service';
import { User } from '../entities/user';

const replyRepository = <Repository<Reply>>mock(Repository);
const replyRepoInstance = instance(replyRepository);
const postRepository = <Repository<Post>>mock(Repository);
const postRepoInstance = instance(postRepository);
const userRepository = <Repository<User>>mock(Repository);
const userRepoInstance = instance(userRepository);

const service = new ReplyService(<Dependencies>{
  replyRepository: replyRepoInstance,
  postRepository: postRepoInstance,
  userRepository: userRepoInstance
});
const user = new User('test');
const testPost = new Post(user, 'category', 'message', 1);
const testReply = new Reply(user, testPost, 'message');

beforeEach(() => {
  reset(replyRepository);
  reset(postRepository);
  reset(userRepository);
});

test('Fetch empty collection of replies', async () => {
  expect.assertions(1);

  when(replyRepository.find()).thenResolve(new Array<Reply>());

  const collection = await service.find();
  expect(collection).toStrictEqual([]);

  verify(replyRepository.find()).called();
});

test('Fetch a reply that exists', async () => {
  expect.assertions(1);

  when(replyRepository.findOne(2)).thenResolve(testReply);

  const reply = await service.findOne(2);
  expect(reply).toStrictEqual(testReply);

  verify(replyRepository.findOne(2)).called();
});

test("Fetch a reply that doesn't exist", async () => {
  expect.assertions(1);

  when(replyRepository.findOne(99)).thenResolve(undefined);

  const reply = await service.findOne(99);
  expect(reply).toBe(undefined);

  verify(replyRepository.findOne(99)).called();
});

test('Delete reply that exists', async () => {
  expect.assertions(1);

  let results = new DeleteResult();
  results.affected = 1;

  when(replyRepository.delete(2)).thenResolve(results);

  const deleted = await service.delete(2);
  expect(deleted.affected).toBe(1);

  verify(replyRepository.delete(2)).called();
});

test("Delete reply that doesn't exist", async () => {
  expect.assertions(1);

  let results = new DeleteResult();
  results.affected = 0;

  when(replyRepository.delete(99)).thenResolve(results);

  const deleted = await service.delete(99);
  expect(deleted.affected).toBe(0);

  verify(replyRepository.delete(99)).called();
});

test('Update reply that exists', async () => {
  expect.assertions(1);

  let results = new UpdateResult();

  when(replyRepository.update(2, deepEqual(testReply))).thenResolve(results);
  when(replyRepository.findOne(2)).thenResolve(testReply);

  const result = await service.update(2, testReply);
  expect(result).toStrictEqual(testReply);

  verify(replyRepository.update(2, deepEqual(testReply))).called();
  verify(replyRepository.findOne(2)).called();
});

test("Update reply that doesn't exist", async () => {
  expect.assertions(1);

  let results = new UpdateResult();

  when(replyRepository.update(99, deepEqual(testReply))).thenResolve(results);
  when(replyRepository.findOne(99)).thenResolve(undefined);

  const result = await service.update(99, testReply);
  expect(result).toBe(undefined);

  verify(replyRepository.update(99, deepEqual(testReply))).called();
  verify(replyRepository.findOne(99)).called();
});

test('Save a new reply', async () => {
  expect.assertions(1);

  when(replyRepository.save(deepEqual(testReply))).thenResolve(testReply);
  when(userRepository.findOne(1)).thenResolve(user);
  when(postRepository.findOne(1)).thenResolve(testPost);

  const result = await service.save(1, 1, 'message');
  expect(result).toStrictEqual(testReply);

  verify(postRepository.findOne(1)).called();
  verify(userRepository.findOne(1)).called();
  verify(replyRepository.save(deepEqual(testReply))).called();
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
