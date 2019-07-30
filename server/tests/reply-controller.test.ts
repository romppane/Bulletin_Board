import { mock, instance, spy, when, verify, deepEqual } from 'ts-mockito';
import { Repository, DeleteResult } from 'typeorm';
import { User } from '../entities/user';
import { Dependencies } from '../types';
import { Request, Response, ErrorRequestHandler, NextFunction } from 'express-serve-static-core';
import { Post } from '../entities/post';
import { validateParams, validateReply, validateReplyPUT } from '../middleware/validation';
import { Reply } from '../entities/reply';
import { ReplyService } from '../service/reply-service';
import { ReplyController } from '../controllers/reply-controller';

const postMockRepository = mock(Repository) as Repository<Post>;
const postMockInstance = instance(postMockRepository);

const userMockRepository = mock(Repository) as Repository<User>;
const userMockInstance = instance(userMockRepository);

const replyMockRepository = mock(Repository) as Repository<Reply>;
const replyMockInstance = instance(replyMockRepository);
const replyService = new ReplyService({
  replyRepository: replyMockInstance,
  postRepository: postMockInstance,
  userRepository: userMockInstance
} as Dependencies);
const spyService = spy(replyService);

const replyController = new ReplyController({
  replyService: replyService,
  validateReply: validateReply,
  validateReplyPUT: validateReplyPUT,
  validateParams: validateParams
} as Dependencies);

let mockReq: Partial<Request> = {};
let mockRes: Partial<Response> = {};
const mockNext: ErrorRequestHandler = () => {};

const testUser = new User('avatar');
const testPost = new Post(testUser, 'category', 'message');
const testReply = new Reply(testUser, testPost, 'message');

test('readAll', () => {
  when(spyService.find()).thenResolve([]);
  replyController.readAll(mockReq as Request, mockRes as Response, mockNext as NextFunction);
  verify(spyService.find()).called();
});

test('readOne return with value', () => {
  when(spyService.findOne(1)).thenResolve(testReply);
  mockReq.params = { id: 1 };
  replyController.readOne(mockReq as Request, mockRes as Response, mockNext as NextFunction);
  verify(spyService.findOne(1)).called();
});

test('readOne return with value', () => {
  when(spyService.findOne(99)).thenResolve(undefined);
  mockReq.params = { id: 99 };
  replyController.readOne(mockReq as Request, mockRes as Response, mockNext as NextFunction);
  verify(spyService.findOne(99)).called();
});

test('create reply with success', () => {
  when(spyService.save(1, 1, 'message')).thenResolve(testReply);
  mockReq.body = { userId: 1, postId: 1, message: 'message' };
  replyController.create(mockReq as Request, mockRes as Response, mockNext as NextFunction);
  verify(spyService.save(1, 1, 'message')).called();
});

test('delete reply', () => {
  const result = new DeleteResult();
  result.affected = 1;
  when(spyService.delete(1)).thenResolve(result);
  mockReq.params = { id: 1 };
  replyController.delete(mockReq as Request, mockRes as Response, mockNext as NextFunction);
  verify(spyService.delete(1)).called();
});

test("delete reply that doesn't exist", () => {
  const result = new DeleteResult();
  result.affected = 0;
  when(spyService.delete(99)).thenResolve(result);
  mockReq.params = { id: 99 };
  replyController.delete(mockReq as Request, mockRes as Response, mockNext as NextFunction);
  verify(spyService.delete(99)).called();
});

test('update reply', () => {
  when(spyService.update(1, deepEqual({ message: 'message' }))).thenResolve(testReply);
  mockReq.body = { message: 'message' };
  replyController.update(mockReq as Request, mockRes as Response, mockNext as NextFunction);
  verify(spyService.update(1, deepEqual({ message: 'message' })));
});

test('update reply on undefined', () => {
  when(spyService.update(1, deepEqual({ message: 'message' }))).thenResolve(undefined);
  mockReq.body = { message: 'message' };
  replyController.update(mockReq as Request, mockRes as Response, mockNext as NextFunction);
  verify(spyService.update(1, deepEqual({ message: 'message' })));
});
