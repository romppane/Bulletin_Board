import { User } from '../entities/user';
import { mock, instance, when, verify, deepEqual, reset } from 'ts-mockito';
import { UserService } from '../service/user-service';
import { Dependencies } from '../types';
import { Repository, DeepPartial, DeleteResult, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

// Creating mock
const mockRepository = <Repository<User>>mock(Repository);
const repoInstance = instance(mockRepository);
const service = new UserService(<Dependencies>{ userRepository: repoInstance });
const testUser = new User('three');
const users: User[] = [new User('one'), new User('two'), testUser];

test('Fetch empty collection of users', () => {
  when(mockRepository.find()).thenResolve(new Array<User>());

  service
    .find()
    .then(collection => {
      expect(collection).toStrictEqual([]);
    })
    .catch(error => console.log(error));

  verify(mockRepository.find()).called();
});

test('Fetch collection with 3 users', () => {
  when(mockRepository.find()).thenResolve(users);

  service
    .find()
    .then(collection => {
      expect(collection).toStrictEqual(users);
    })
    .catch(error => console.log(error));

  verify(mockRepository.find()).called();
});

test('Fetch a user that exists', () => {
  when(mockRepository.findOne(2)).thenResolve(testUser);
  service
    .findOne(2)
    .then(user => {
      expect(user).toStrictEqual(testUser);
    })
    .catch(error => console.log(error));
  verify(mockRepository.findOne(2)).called();
});

test("Fetch a user that doesn't exist", () => {
  when(mockRepository.findOne(99)).thenResolve(undefined);

  service
    .findOne(99)
    .then(user => {
      expect(user).toBe(undefined);
    })
    .catch(error => console.log(error));

  verify(mockRepository.findOne(99)).called();
});

test('Delete user that exists', () => {
  let results = new DeleteResult();
  results.affected = 1;
  when(mockRepository.delete(2)).thenResolve(results);

  service
    .delete(2)
    .then(deleted => {
      expect(deleted.affected).toBe(1);
    })
    .catch(error => console.log(error));

  verify(mockRepository.delete(2)).called();
});

test("Delete user that doesn't exist", () => {
  let results = new DeleteResult();
  results.affected = 0;
  when(mockRepository.delete(99)).thenResolve(results);

  service
    .delete(99)
    .then(deleted => {
      expect(deleted.affected).toBe(0);
    })
    .catch(error => console.log(error));

  verify(mockRepository.delete(99)).called();
});

test('Update user that exists', () => {
  let results = new UpdateResult();
  when(mockRepository.update(2, deepEqual(testUser))).thenResolve(results);
  when(mockRepository.findOne(2)).thenResolve(testUser);
  service
    .update(2, testUser)
    .then(result => {
      expect(result).toStrictEqual(testUser);
    })
    .catch(error => console.log(error));
});

test("Update user that doesn't exist", () => {
  let results = new UpdateResult();
  when(mockRepository.update(99, deepEqual(testUser))).thenResolve(results);
  when(mockRepository.findOne(99)).thenResolve(undefined);
  service
    .update(99, testUser)
    .then(result => {
      expect(result).toBe(undefined);
    })
    .catch(error => console.log(error));
});

test('Save a new user', () => {
  when(mockRepository.save(deepEqual(testUser))).thenResolve(testUser);
  service
    .save('three')
    .then(user => {
      expect(user).toStrictEqual(testUser);
    })
    .catch(error => console.log(error));

  verify(mockRepository.save(testUser));
});
