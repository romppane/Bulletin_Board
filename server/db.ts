import { createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Environment } from './environment';
import { User } from './entities/user';
import { Post } from './entities/post';
import { Comment } from './entities/comment';

export const connectDB = (Env: Environment) => {
  const db: MysqlConnectionOptions = {
    type: 'mariadb',
    url: Env.DB_URL,
    database: Env.DB_NAME,
    synchronize: Env.DB_SYNCHRONIZE,
    logging: Env.DB_LOGGING,
    entities: [User, Post, Comment]
  };
  return createConnection(db);
};
