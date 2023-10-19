import {NextFunction, Request, Response} from 'express';

export interface ValidationMiddleware {
  validate(req: Request, res: Response, next: NextFunction): void;
}