import { createConnection } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Environment } from './environment';

export const connectDB = (Env: Environment) => {
  const db: MysqlConnectionOptions = {
    type: 'mariadb',
    url: Env.DB_URL,
    database: Env.DB_NAME,
    synchronize: Env.DB_SYNCHRONIZE,
    logging: Env.DB_LOGGING,
    entities: [Env.DB_ENTITIES],
    cli: {
      entitiesDir: 'entities'
    }
  };
  return createConnection(db);
};
