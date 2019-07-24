import dotenv from 'dotenv';
import { createConnection } from 'typeorm';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Environment } from './environment';

// Load .env if exists
dotenv.config();

// Make Environment type object of the current env variables
export const Env = plainToClass(Environment, {
  DB_URL: process.env.DB_URL,
  DB_NAME: process.env.DB_NAME,
  DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE,
  DB_LOGGING: process.env.DB_LOGGING,
  DB_ENTITIES: process.env.DB_ENTITIES,
  PORT: process.env.PORT
});

export const validateEnv = () => {
  return validate(Env).then(errors => {
    if (errors.length > 0) {
      console.log(errors);
      return false;
    } else {
      return true;
    }
  });
};

export const connectDB = () => {
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
