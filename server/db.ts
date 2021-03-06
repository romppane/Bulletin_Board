import { createConnection, getConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Environment } from './environment';
import { User } from './entities/user';
import { Post } from './entities/post';
import { Comment } from './entities/comment';
import { UserSeed1565945881563 } from './migrations/1565945881563-UserSeed';
import { TemporaryUsernames1566461589946 } from './migrations/1566461589946-TemporaryUsernames';

export const connectDB = (Env: Environment) => {
  const db: MysqlConnectionOptions = Env.DB_SYNCHRONIZE
    ? {
        type: 'mariadb',
        url: Env.DB_URL,
        database: Env.DB_NAME,
        synchronize: Env.DB_SYNCHRONIZE,
        logging: Env.DB_LOGGING,
        entities: [User, Post, Comment],
        migrations: [UserSeed1565945881563]
      }
    : {
        type: 'mariadb',
        url: Env.DB_URL,
        database: Env.DB_NAME,
        synchronize: Env.DB_SYNCHRONIZE,
        logging: Env.DB_LOGGING,
        entities: [User, Post, Comment],
        migrations: [UserSeed1565945881563, TemporaryUsernames1566461589946]
      };

  return createConnection(db).then(async connection => {
    await connection.runMigrations();
    return getConnection();
  });
};
