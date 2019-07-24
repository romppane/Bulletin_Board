import { Matches, MinLength, IsBoolean, IsNotEmpty, Min, validate } from 'class-validator';
import { Expose, Transform, Type, plainToClass } from 'class-transformer';
import dotenv from 'dotenv';

export class Environment {
  @Matches(new RegExp('mysql://\\w+:\\w+@.+:\\d+/\\w+', 'g'))
  @MinLength(17)
  @Expose()
  DB_URL: string;

  @Matches(new RegExp('^[^\\/?%*:|"<>.]{1,64}$'))
  @Expose()
  DB_NAME: string;

  @IsBoolean()
  @Expose()
  @Transform(value => value == 'true')
  DB_SYNCHRONIZE: boolean;

  @Expose()
  @IsBoolean()
  @Transform(value => value == 'true')
  DB_LOGGING: boolean;

  @IsNotEmpty()
  @Expose()
  DB_ENTITIES: string;

  @Min(1000)
  @Expose()
  @Type(() => Number)
  PORT: number;

  constructor(
    DB_URL: string,
    DB_NAME: string,
    DB_SYNCHRONIZE: boolean,
    DB_LOGGING: boolean,
    DB_ENTITIES: string,
    PORT: number
  ) {
    this.DB_URL = DB_URL;
    this.DB_NAME = DB_NAME;
    this.DB_SYNCHRONIZE = DB_SYNCHRONIZE;
    this.DB_LOGGING = DB_LOGGING;
    this.DB_ENTITIES = DB_ENTITIES;
    this.PORT = PORT;
  }
}

// Load .env if exists
dotenv.config();

export const validateEnv = () => {
  // Make Environment type object of the current env variables
  const Env = plainToClass(Environment, {
    DB_URL: process.env.DB_URL,
    DB_NAME: process.env.DB_NAME,
    DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE,
    DB_LOGGING: process.env.DB_LOGGING,
    DB_ENTITIES: process.env.DB_ENTITIES,
    PORT: process.env.PORT
  });
  return validate(Env).then(errors => {
    if (errors.length > 0) {
      throw errors;
    } else {
      return Env;
    }
  });
};
