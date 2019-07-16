import { DeleteResult, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface Service {
  find(): Promise<any>;
  findOne(id: number): Promise<any>;
  save(): Promise<any>;
  delete(id: number): Promise<DeleteResult>;
  update(id: number, obj: QueryDeepPartialEntity<any>): Promise<UpdateResult>;
}
