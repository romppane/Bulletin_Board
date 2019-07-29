import { Repository, DeleteResult } from 'typeorm';
import { User } from '../entities/user';
import { mock, instance, spy, when, verify, deepEqual } from 'ts-mockito';
import { UserService } from '../service/user-service';
import { Dependencies } from '../types';
import { UserController } from '../controllers/user-controller';
import { validateParams } from '../middleware/validation';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express-serve-static-core';

const mockRepository = mock(Repository) as Repository<User>;
const repoInstance = instance(mockRepository);
const userService = new UserService({ userRepository: repoInstance } as Dependencies);
const spyService = spy(userService);

let mockReq: Partial<Request> = {};
let mockRes: Partial<Response> = {};
const mockNext: ErrorRequestHandler = () => {};

const testUser = new User('avatar');

const userController = new UserController({
  userService: userService,
  validateParams: validateParams
} as Dependencies);

test('readAll from empty collection', () => {
  when(spyService.find()).thenResolve([]);
  userController.readAll(mockReq as Request, mockRes as Response, mockNext as NextFunction);
  verify(spyService.find()).called();
});

test('readOne user found', () => {
  when(spyService.findOne(1)).thenResolve(testUser);
  mockReq.params = { id: 1 };
  userController
    .readOne(mockReq as Request, mockRes as Response, mockNext as NextFunction)
    .catch(error => console.log(error));
  verify(spyService.findOne(1)).called();
});

test('readOne user not found', () => {
  when(spyService.findOne(1)).thenResolve(undefined);
  mockReq.params = { id: 1 };
  userController
    .readOne(mockReq as Request, mockRes as Response, mockNext as NextFunction)
    .catch(error => console.log(error));
  verify(spyService.findOne(1)).called();
});

test('create new user', () => {
  when(spyService.save('avatar')).thenResolve(testUser);
  mockReq.body = { avatar: 'avatar' };
  userController
    .create(mockReq as Request, mockRes as Response, mockNext as NextFunction)
    .catch(error => console.log(error));
  verify(spyService.save('avatar')).called();
});

test('User deleted', () => {
  let deleteResult = new DeleteResult();
  deleteResult.affected = 1;
  when(spyService.delete(1)).thenResolve(deleteResult);
  mockReq.params = { id: 1 };
  userController
    .delete(mockReq as Request, mockRes as Response, mockNext as NextFunction)
    .catch(error => console.log(error));

  verify(spyService.delete(1)).called();
});

test('No user to delete', () => {
  let deleteResult = new DeleteResult();
  deleteResult.affected = 0;
  when(spyService.delete(1)).thenResolve(deleteResult);
  mockReq.params = { id: 1 };
  userController
    .delete(mockReq as Request, mockRes as Response, mockNext as NextFunction)
    .catch(error => console.log(error));

  verify(spyService.delete(1)).called();
});

test('Update user', () => {
  when(spyService.update(1, deepEqual({ avatar: 'avatar' }))).thenResolve(testUser);
  mockReq.body = { avatar: 'avatar' };
  mockReq.params = { id: 1 };
  userController
    .update(mockReq as Request, mockRes as Response, mockNext as NextFunction)
    .catch(error => console.log(error));

  verify(spyService.update(1, deepEqual({ avatar: 'avatar' }))).called();
});

test('Update user undefined', () => {
  when(spyService.update(1, deepEqual({ avatar: 'avatar' }))).thenResolve(undefined);
  mockReq.body = { avatar: 'avatar' };
  mockReq.params = { id: 1 };
  userController
    .update(mockReq as Request, mockRes as Response, mockNext as NextFunction)
    .catch(error => console.log(error));

  verify(spyService.update(1, deepEqual({ avatar: 'avatar' }))).called();
});
