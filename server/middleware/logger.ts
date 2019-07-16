import morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment-timezone';
import express from 'express';

export class Logger {
  infoLogStream: fs.WriteStream;
  errorLogStream: fs.WriteStream;
  constructor() {
    this.infoLogStream = fs.createWriteStream(path.join('.', 'logs', 'info.log'), {
      flags: 'a'
    });
    this.errorLogStream = fs.createWriteStream(path.join('.', 'logs', 'error.log'), {
      flags: 'a'
    });

    morgan.token('date', () => {
      return moment.tz('Europe/Helsinki').format();
    });

    morgan.format(
      'outFormat',
      ':remote-addr [:date] :method [:url] HTTP/:http-version [:status] :res[content-length] - :response-time ms [:user-agent]'
    );

    morgan.format(
      'incFormat',
      ':remote-addr [:date] :method [:url] HTTP/:http-version [:user-agent]'
    );
  }

  incomingRequests() {
    return morgan('incFormat', {
      immediate: true,
      stream: this.infoLogStream
    });
  }

  successfulResponces() {
    return morgan('outFormat', {
      skip: (req: express.Request, res: express.Response) => {
        return res.statusCode >= 399;
      },
      stream: this.infoLogStream
    });
  }

  errorResponces() {
    return morgan('outFormat', {
      skip: (req: express.Request, res: express.Response) => {
        return res.statusCode < 400;
      },
      stream: this.errorLogStream
    });
  }
}
