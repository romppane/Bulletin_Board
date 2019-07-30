import { User } from '../entities/user';
import { mock, instance, when, verify, deepEqual, resetCalls } from 'ts-mockito';
import { UserService } from '../service/user-service';
import { Dependencies } from '../types';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';

const mockRepository = <Repository<User>>mock(Repository);
const repoInstance = instance(mockRepository);
const service = new UserService(<Dependencies>{ userRepository: repoInstance });
const testUser = new User('three');
const users: User[] = [new User('one'), new User('two'), testUser];

beforeEach(() => {
  resetCalls(mockRepository);
});

test('Fetch empty collection of users', async () => {
  expect.assertions(1);

  when(mockRepository.find()).thenResolve(new Array<User>());

  const collection = await service.find();
  expect(collection).toStrictEqual([]);

  verify(mockRepository.find()).called();
});

test('Fetch collection with 3 users', async () => {
  expect.assertions(1);

  when(mockRepository.find()).thenResolve(users);

  const collection = await service.find();
  expect(collection).toStrictEqual(users);

  verify(mockRepository.find()).called();
});

test('Fetch a user that exists', async () => {
  expect.assertions(1);

  when(mockRepository.findOne(2)).thenResolve(testUser);

  const user = await service.findOne(2);
  expect(user).toStrictEqual(testUser);

  verify(mockRepository.findOne(2)).called();
});

test("Fetch a user that doesn't exist", async () => {
  expect.assertions(1);

  when(mockRepository.findOne(99)).thenResolve(undefined);

  const user = await service.findOne(99);
  expect(user).toBe(undefined);

  verify(mockRepository.findOne(99)).called();
});

test('Delete user that exists', async () => {
  expect.assertions(1);

  let results = new DeleteResult();
  results.affected = 1;

  when(mockRepository.delete(2)).thenResolve(results);

  const deleted = await service.delete(2);
  expect(deleted.affected).toBe(1);

  verify(mockRepository.delete(2)).called();
});

test("Delete user that doesn't exist", async () => {
  expect.assertions(1);

  let results = new DeleteResult();
  results.affected = 0;

  when(mockRepository.delete(99)).thenResolve(results);

  const deleted = await service.delete(99);
  expect(deleted.affected).toBe(0);

  verify(mockRepository.delete(99)).called();
});

test('Update user that exists', async () => {
  expect.assertions(1);

  let results = new UpdateResult();

  when(mockRepository.update(2, deepEqual(testUser))).thenResolve(results);
  when(mockRepository.findOne(2)).thenResolve(testUser);

  const result = await service.update(2, testUser);
  expect(result).toStrictEqual(testUser);

  verify(mockRepository.update(2, deepEqual(testUser))).called();
  verify(mockRepository.findOne(2)).called();
});

test("Update user that doesn't exist", async () => {
  expect.assertions(1);

  let results = new UpdateResult();

  when(mockRepository.update(99, deepEqual(testUser))).thenResolve(results);
  when(mockRepository.findOne(99)).thenResolve(undefined);

  const result = await service.update(99, testUser);
  expect(result).toBe(undefined);

  verify(mockRepository.update(99, deepEqual(testUser))).called();
  verify(mockRepository.findOne(99)).called();
});

test('Save a new user', async () => {
  expect.assertions(1);

  when(mockRepository.save(deepEqual(testUser))).thenResolve(testUser);

  const user = await service.save('three');
  expect(user).toStrictEqual(testUser);

  verify(mockRepository.save(testUser));
});
