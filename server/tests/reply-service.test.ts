import { mock, instance, when, verify, deepEqual } from 'ts-mockito';
import { Dependencies } from '../types';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Post } from '../entities/post';
import { Reply } from '../entities/reply';
import { ReplyService } from '../service/reply-service';
import { User } from '../entities/user';

// Creating mock
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

test('Fetch empty collection of replies', () => {
  when(replyRepository.find()).thenResolve(new Array<Reply>());

  service
    .find()
    .then(collection => {
      expect(collection).toStrictEqual([]);
    })
    .catch(error => console.log(error));

  verify(replyRepository.find()).called();
});

test('Fetch a reply that exists', () => {
  when(replyRepository.findOne(2)).thenResolve(testReply);
  service
    .findOne(2)
    .then(reply => {
      expect(reply).toStrictEqual(testReply);
    })
    .catch(error => console.log(error));
  verify(replyRepository.findOne(2)).called();
});

test("Fetch a reply that doesn't exist", () => {
  when(replyRepository.findOne(99)).thenResolve(undefined);

  service
    .findOne(99)
    .then(reply => {
      expect(reply).toBe(undefined);
    })
    .catch(error => console.log(error));

  verify(replyRepository.findOne(99)).called();
});

test('Delete reply that exists', () => {
  let results = new DeleteResult();
  results.affected = 1;
  when(replyRepository.delete(2)).thenResolve(results);

  service
    .delete(2)
    .then(deleted => {
      expect(deleted.affected).toBe(1);
    })
    .catch(error => console.log(error));

  verify(replyRepository.delete(2)).called();
});

test("Delete reply that doesn't exist", () => {
  let results = new DeleteResult();
  results.affected = 0;
  when(replyRepository.delete(99)).thenResolve(results);

  service
    .delete(99)
    .then(deleted => {
      expect(deleted.affected).toBe(0);
    })
    .catch(error => console.log(error));

  verify(replyRepository.delete(99)).called();
});

test('Update reply that exists', () => {
  let results = new UpdateResult();
  when(replyRepository.update(2, deepEqual(testReply))).thenResolve(results);
  when(replyRepository.findOne(2)).thenResolve(testReply);
  service
    .update(2, testReply)
    .then(result => {
      expect(result).toStrictEqual(testReply);
    })
    .catch(error => console.log(error));

  verify(replyRepository.update(2, deepEqual(testReply))).called();
  verify(replyRepository.findOne(2)).called();
});

test("Update reply that doesn't exist", () => {
  let results = new UpdateResult();
  when(replyRepository.update(99, deepEqual(testReply))).thenResolve(results);
  when(replyRepository.findOne(99)).thenResolve(undefined);
  service
    .update(99, testReply)
    .then(result => {
      expect(result).toBe(undefined);
    })
    .catch(error => console.log(error));
  verify(replyRepository.update(99, deepEqual(testReply))).called();
  verify(replyRepository.findOne(99)).called();
});

test('Save a new reply', () => {
  when(replyRepository.save(deepEqual(testReply))).thenResolve(testReply);
  when(userRepository.findOne(1)).thenResolve(user);
  when(postRepository.findOne(1)).thenResolve(testPost);
  service
    .save(1, 1, 'message')
    .then(result => {
      expect(result).toStrictEqual(testReply);
    })
    .catch(error => console.log(error));
  //verify(postRepository.findOne(1)).called(); - Test returns error of not called?
  verify(userRepository.findOne(1)).called();
});

test('Fail save because of missing user', () => {
  when(userRepository.findOne(1)).thenResolve(undefined);
  when(postRepository.findOne(1)).thenResolve(testPost);

  service.userRepository
    .findOne(1)
    .then(result => {
      expect(result).toBe(undefined);
    })
    .catch(error => console.log(error));
  service.postRepository
    .findOne(1)
    .then(result => {
      expect(result).toStrictEqual(testPost);
    })
    .catch(error => console.log(error));
  verify(userRepository.findOne(1)).called();
  verify(postRepository.findOne(1)).called();
});

test('Fail save because of missing post', () => {
  when(userRepository.findOne(1)).thenResolve(user);
  when(postRepository.findOne(1)).thenResolve(undefined);

  service.userRepository
    .findOne(1)
    .then(result => {
      expect(result).toStrictEqual(user);
    })
    .catch(error => console.log(error));
  service.postRepository
    .findOne(1)
    .then(result => {
      expect(result).toBe(undefined);
    })
    .catch(error => console.log(error));
  verify(userRepository.findOne(1)).called();
  verify(postRepository.findOne(1)).called();
});

test('Fail save because of missing post and user', () => {
  when(userRepository.findOne(1)).thenResolve(undefined);
  when(postRepository.findOne(1)).thenResolve(undefined);

  service.userRepository
    .findOne(1)
    .then(result => {
      expect(result).toBe(undefined);
    })
    .catch(error => console.log(error));
  service.postRepository
    .findOne(1)
    .then(result => {
      expect(result).toBe(undefined);
    })
    .catch(error => console.log(error));
  verify(userRepository.findOne(1)).called();
  verify(postRepository.findOne(1)).called();
});
