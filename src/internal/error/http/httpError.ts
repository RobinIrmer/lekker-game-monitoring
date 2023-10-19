import {Error as _Error} from '../error';

export class HttpError extends Error implements _Error, Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}
